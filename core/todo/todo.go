package todo

import (
	"checklist/core/db"
	"checklist/core/models"
)

func AddTodo(name, description string) error {
	return db.DB.Create(&models.Todo{Name: name, Completed: false, Description: description}).Error
}

func GetTodos() ([]models.Todo, error) {
	var todos []models.Todo

	result := db.DB.Find(&todos)
	return todos, result.Error
}
