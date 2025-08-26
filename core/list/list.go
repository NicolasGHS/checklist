package list

import (
	"checklist/core/db"
	"checklist/core/models"
)

func GetLists() ([]models.List, error) {
	var lists []models.List

	result := db.DB.Not("id = 1").Find(&lists)
	return lists, result.Error
}

func GetListBySlug(slug string) (models.List, error) {
	var list models.List

	result := db.DB.Where("slug = ?", slug).Find(&list)
	return list, result.Error
}

func AddList(name, description string) error {
	return db.DB.Create(&models.List{Name: name}).Error
}
