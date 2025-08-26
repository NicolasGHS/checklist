package list

import (
	"checklist/core/db"
	"checklist/core/models"

	"github.com/gosimple/slug"
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

func MakeSlug(name string) string {
	newSlug := slug.Make(name)

	return newSlug
}

func AddList(name, description string) error {

	slug := MakeSlug(name)

	return db.DB.Create(&models.List{Name: name, Slug: slug}).Error
}
