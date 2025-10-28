package repository

import (
	"checklist/core/db"
	"checklist/core/models"
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
