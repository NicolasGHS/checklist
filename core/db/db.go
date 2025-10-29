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
	configDir, err := os.UserConfigDir()
	if err != nil {
		return "", nil
	}
	appDir := filepath.Join(configDir, "Checklist")
	os.MkdirAll(appDir, os.ModePerm)

	return filepath.Join(appDir, "todos.db"), nil
}

func InitDB() error {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return err
	}
	appDir := filepath.Join(configDir, "Checklist")
	os.MkdirAll(appDir, os.ModePerm)

	dbPath := filepath.Join(appDir, "todos.db")

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

	DB = database
	return nil
}
