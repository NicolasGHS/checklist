package api

import (
	"checklist/core/models"
	"checklist/core/repository"
)

func GetAreas() ([]models.Area, error) {
	response, err := repository.GetAreas()
	if err != nil {
		return nil, err
	}

	return response, nil
}

func AddArea(name string) error {
	result := repository.AddArea(name)

	return result
}
