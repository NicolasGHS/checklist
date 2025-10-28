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

func MakeSlug(name string) string {
	response, err := repository.GetListByName(name)

	if err == nil && response.ID != 0 {
		newSlug := slug.Make(fmt.Sprintf("%s%d", name, response.ID))
		return newSlug
	}

	newSlug := slug.Make(name)

	return newSlug
}

func AddList(name string) error {
	slug := MakeSlug(name)

	response := repository.AddList(name, slug, 0)
	if response != nil {
		return response
	}

	return nil
}

func AddListWithArea(name, description string, areaId int32) error {
	slug := MakeSlug(name)

	response := repository.AddList(name, slug, areaId)
	if response != nil {
		return response
	}

	return nil
}

func DeleteList(id uint) error {
	response := repository.DeleteList(id)
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
