package repository

import (
	"checklist/core/db"
	"checklist/core/models"
)

func GetLists() ([]models.List, error) {
	var lists []models.List

	result := db.DB.Not("id = 1").Find(&lists)
	if result.Error != nil {
		return nil, result.Error
	}

	return lists, nil
}

func GetListsBySlug(slug string) (models.List, error) {
	var list models.List

	result := db.DB.Where("slug = ?", slug).Find(&list)
	if result.Error != nil {
		return list, result.Error
	}

	return list, nil
}

func GetListsByArea(id uint) ([]models.List, error) {
	var lists []models.List

	result := db.DB.Where("area_id = ?", id).Find(&lists)
	if result.Error != nil {
		return nil, result.Error
	}

	return lists, nil
}

func GetListByName(name string) (models.List, error) {
	var list models.List

	result := db.DB.Where("name = ?", name).Find(&list)

	if result.Error != nil {
		return list, result.Error
	}

	return list, nil
}

func GetListsWithoutArea() ([]models.List, error) {
	var lists []models.List

	result := db.DB.Where("area_id = 0 AND name != ?", "Inbox").Find(&lists)
	if result.Error != nil {
		return nil, result.Error
	}

	return lists, nil
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

func AddList(name, slug string, areaId int32) error {

	if areaId != 0 {
		result := db.DB.Create(&models.List{Name: name, Slug: slug, AreaID: areaId}).Error
		if result != nil {
			return result
		}
		return nil
	} else {
		result := db.DB.Create(&models.List{Name: name, Slug: slug}).Error
		if result != nil {
			return result
		}
		return nil
	}
}

func UpdateListArea(id uint, areaID uint) error {
	response := db.DB.Model(&models.List{}).Where("id = ?", id).Update("area_id", areaID).Error

	if response != nil {
		return response
	}
	return nil
}

func DeleteList(id uint) error {
	response := db.DB.Delete(&models.List{}, id).Error
	if response != nil {
		return response
	}
	return nil
}
