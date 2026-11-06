package repository

import (
	"checklist/core/db"
	"checklist/core/models"
	"errors"

	"gorm.io/gorm"
)

// InboxListID is the built-in Inbox list, created on first start.
const InboxListID = 1

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

func GetListsWithoutArea() ([]models.List, error) {
	var lists []models.List

	result := db.DB.Where("area_id = 0 AND id != ?", InboxListID).Find(&lists)
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

// SlugExists reports whether a list already uses slug.
func SlugExists(slug string) (bool, error) {
	var count int64
	err := db.DB.Model(&models.List{}).Where("slug = ?", slug).Count(&count).Error
	return count > 0, err
}

// DeleteList removes a list. Its tasks are deleted along with it when
// deleteTasks is true, otherwise they move to the Inbox (completed ones keep
// their state, so they stay in the Logbook).
func DeleteList(id uint, deleteTasks bool) error {
	if id == InboxListID {
		return errors.New("the Inbox cannot be deleted")
	}
	return db.DB.Transaction(func(tx *gorm.DB) error {
		if deleteTasks {
			topLevel := tx.Model(&models.Todo{}).Select("id").Where("list_id = ? AND parent_id IS NULL", id)
			if err := tx.Where("parent_id IN (?)", topLevel).Delete(&models.Todo{}).Error; err != nil {
				return err
			}
			if err := tx.Where("list_id = ? AND parent_id IS NULL", id).Delete(&models.Todo{}).Error; err != nil {
				return err
			}
		} else {
			// position 0 = unplaced, so moved tasks go to the bottom of the Inbox
			if err := tx.Model(&models.Todo{}).Where("list_id = ? AND parent_id IS NULL", id).
				Updates(map[string]any{"list_id": InboxListID, "position": 0}).Error; err != nil {
				return err
			}
		}
		return tx.Delete(&models.List{}, id).Error
	})
}
