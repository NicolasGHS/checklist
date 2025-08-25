package todo

import (
	"checklist/core/db"
	"checklist/core/models"
)

func GetTodos() ([]models.Todo, error) {
	var todos []models.Todo

	result := db.DB.Find(&todos)
	return todos, result.Error
}

func GetTodoById(id uint) (models.Todo, error) {
	var todo models.Todo

	_ = db.DB.First(&todo)

	return todo, nil
}

func AddTodo(name, description string) error {
	return db.DB.Create(&models.Todo{Name: name, Completed: false, Description: description}).Error
}

func ToggleTodo(id uint) error {
	var todo models.Todo

	_ = db.DB.Find(&todo)

	todo.Completed = !todo.Completed

	db.DB.Save(&todo)
	return nil
}
