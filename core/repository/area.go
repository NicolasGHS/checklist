package repository

import (
	"checklist/core/db"
	"checklist/core/models"

	"gorm.io/gorm"
)

func GetAreas() ([]models.Area, error) {
	var areas []models.Area

	result := db.DB.Find(&areas)
	if result.Error != nil {
		return nil, result.Error
	}

	return areas, nil
}

func AddArea(name string) error {
	result := db.DB.Create(&models.Area{Name: name}).Error

	return result
}

// DeleteArea removes an area; its lists stay and become area-less.
func DeleteArea(id uint) error {
	return db.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.List{}).Where("area_id = ?", id).
			Update("area_id", 0).Error; err != nil {
			return err
		}
		return tx.Delete(&models.Area{}, id).Error
	})
}
