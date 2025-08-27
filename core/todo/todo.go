package todo

import (
	"checklist/core/db"
	"checklist/core/models"
	"fmt"
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

func GetInboxTasks() ([]models.Todo, error) {
	var todos []models.Todo

	_ = db.DB.Where("list_id = ?", 1).Find(&todos)

	fmt.Printf("todos in inbox: %v", todos)

	return todos, nil
}

func GetTodosByList(id uint) ([]models.Todo, error) {
	var todos []models.Todo

	_ = db.DB.Where("list_id = ?", id).Find(&todos)
	return todos, nil
}

func AddTodo(name, description string, list_id uint) error {
	return db.DB.Create(&models.Todo{Name: name, Completed: false, Description: description, ListID: list_id}).Error
}

func ToggleTodo(id uint) error {
	var todo models.Todo

	_ = db.DB.Find(&todo)

	todo.Completed = !todo.Completed

	db.DB.Save(&todo)
	return nil
}
