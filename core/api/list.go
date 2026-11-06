package api

import (
	"checklist/core/models"
	"checklist/core/repository"
	"fmt"

	"github.com/gosimple/slug"
)

func GetLists() ([]models.List, error) {
	response, err := repository.GetLists()
	if err != nil {
		return nil, err
	}

	return response, nil
}

func GetListBySlug(slug string) (models.List, error) {
	response, err := repository.GetListsBySlug(slug)
	if err != nil {
		return response, err
	}

	return response, nil
}

func GetListsByArea(id uint) ([]models.List, error) {
	response, err := repository.GetListsByArea(id)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func GetListsWithoutArea() ([]models.List, error) {
	response, err := repository.GetListsWithoutArea()
	if err != nil {
		return nil, err
	}

	return response, nil
}

// MakeSlug returns a slug for name that no other list uses yet.
func MakeSlug(name string) (string, error) {
	base := slug.Make(name)
	candidate := base
	for i := 2; ; i++ {
		exists, err := repository.SlugExists(candidate)
		if err != nil {
			return "", err
		}
		if !exists {
			return candidate, nil
		}
		candidate = fmt.Sprintf("%s-%d", base, i)
	}
}

func AddList(name string) error {
	slug, err := MakeSlug(name)
	if err != nil {
		return err
	}

	response := repository.AddList(name, slug, 0)
	if response != nil {
		return response
	}

	return nil
}

func AddListWithArea(name, description string, areaId int32) error {
	slug, err := MakeSlug(name)
	if err != nil {
		return err
	}

	response := repository.AddList(name, slug, areaId)
	if response != nil {
		return response
	}

	return nil
}

func DeleteList(id uint, deleteTasks bool) error {
	response := repository.DeleteList(id, deleteTasks)
	if response != nil {
		return response
	}
	return nil
}

func UpdateListArea(id uint, areaID uint) error {
	response := repository.UpdateListArea(id, areaID)
	if response != nil {
		return response
	}
	return nil
}

func GetListsWithArchivedTodos() ([]models.List, error) {
	response, err := repository.GetListsWithArchivedTodos()

	if err != nil {
		return nil, err
	}

	return response, nil
}
