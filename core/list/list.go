package list

import (
	"checklist/core/db"
	"checklist/core/models"
)

func AddList(name, description string) error {
	return db.DB.Create(&models.List{Name: name}).Error
}

func GetLists() ([]models.List, error) {
	var lists []models.List

	result := db.DB.Not("id = 1").Find(&lists)
	return lists, result.Error
}
