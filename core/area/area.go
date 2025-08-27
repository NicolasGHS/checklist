package area

import (
	"checklist/core/db"
	"checklist/core/models"
)

func GetAreas() ([]models.Area, error) {
	var areas []models.Area

	result := db.DB.Find(&areas)
	return areas, result.Error
}

func AddArea(name string) error {
	return db.DB.Create(&models.Area{Name: name}).Error
}
