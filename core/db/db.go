package db

import (
	"checklist/core/models"
	"os"
	"path/filepath"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func GetAppDataPath() (string, error) {
	s := LoadSettings()
	if s.SyncFolder != "" {
		os.MkdirAll(s.SyncFolder, os.ModePerm)
		return filepath.Join(s.SyncFolder, "todos.db"), nil
	}
	configDir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	appDir := filepath.Join(configDir, "Checklist")
	os.MkdirAll(appDir, os.ModePerm)
	return filepath.Join(appDir, "todos.db"), nil
}

func InitDB() error {
	dbPath, err := GetAppDataPath()
	if err != nil {
		return err
	}

	database, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return err
	}

	database.AutoMigrate(&models.Todo{}, &models.Area{}, &models.List{}, &models.Note{})

	var inbox models.List
	result := database.First(&inbox, 1)
	if result.Error != nil {
		inbox = models.List{
			ID:   1,
			Name: "Inbox",
			Slug: "inbox",
		}
		database.Create(&inbox)
	}

	if err := repairOrphans(database); err != nil {
		return err
	}

	DB = database
	return nil
}

// repairOrphans re-homes rows left behind by older versions that deleted
// lists and areas without touching what pointed at them: top-level tasks of a
// missing list (or list 0) go to the Inbox, and lists of a missing area
// become area-less. Both are no-ops on a healthy database.
func repairOrphans(database *gorm.DB) error {
	if err := database.Exec(
		"UPDATE todos SET list_id = 1, position = 0 WHERE parent_id IS NULL AND list_id NOT IN (SELECT id FROM lists)",
	).Error; err != nil {
		return err
	}
	return database.Exec(
		"UPDATE lists SET area_id = 0 WHERE area_id != 0 AND area_id NOT IN (SELECT id FROM areas)",
	).Error
}
