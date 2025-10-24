package api

import (
	"checklist/core/db"
	"checklist/core/models"
	"fmt"

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

func GetListsByArea(id uint) ([]models.List, error) {
	var lists []models.List

	result := db.DB.Where("area_id = ?", id).Find(&lists)
	if result.Error != nil {
		return nil, result.Error
	}
	return lists, nil
}

func GetListsWithoutArea() ([]models.List, error) {
	var lists []models.List

	result := db.DB.Where("area_id = 0 AND name != ?", "Inbox").Find(&lists)

	if result.Error != nil {
		return nil, result.Error
	}

	return lists, nil
}

func MakeSlug(name string) string {
	var lists []models.List

	_ = db.DB.Where("name = ?", name).Find(&lists)

	if len(lists) != 0 {
		newSlug := slug.Make(fmt.Sprintf("%s%d", name, len(lists)))
		return newSlug
	}

	newSlug := slug.Make(name)

	return newSlug
}

func AddList(name, description string) error {

	slug := MakeSlug(name)

	return db.DB.Create(&models.List{Name: name, Slug: slug}).Error
}

func AddListWithArea(name, description string, areaId int32) error {

	slug := MakeSlug(name)

	return db.DB.Create(&models.List{Name: name, Slug: slug, AreaID: areaId}).Error
}

func DeleteList(id uint) error {
	return db.DB.Delete(&models.List{}, id).Error
}

func UpdateListArea(id uint, areaID uint) error {
	return db.DB.Model(&models.List{}).Where("id = ?", id).Update("area_id", areaID).Error
}

func GetListsWithArchivedTodos() ([]models.List, error) {
	var lists []models.List

	result := db.DB.Where("id IN (?)",
		db.DB.Table("todos").Select("DISTINCT list_id").Where("archive = 1")).Find(&lists)

	if result.Error != nil {
		return nil, result.Error
	}

	return lists, nil
}
