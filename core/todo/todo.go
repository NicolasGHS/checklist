package todo

import (
	"checklist/core/db"
	"checklist/core/models"
	"time"
)

func GetTodos() ([]models.Todo, error) {
	var todos []models.Todo

	result := db.DB.Find(&todos)
	return todos, result.Error
}

func GetTodosByList(id uint) ([]models.Todo, error) {
	var todos []models.Todo

	_ = db.DB.Where("list_id = ?", id).Order("completed asc").Find(&todos)
	return todos, nil
}

func AddTodo(name, description string, list_id uint, today bool, deadline time.Time) error {
	return db.DB.Create(&models.Todo{Name: name, Completed: false, Description: description, ListID: list_id, Today: today, Deadline: deadline}).Error
}

func ToggleTodo(id uint) error {
	var todo models.Todo

	_ = db.DB.Where("id = ?", id).Find(&todo)

	todo.Completed = !todo.Completed

	db.DB.Save(&todo)
	return nil
}

func UpdateTodoList(id uint, listID uint) error {
	var todo models.Todo

	err := db.DB.Where("id = ?", id).First(&todo).Error
	if err != nil {
		return err
	}

	todo.ListID = listID
	return db.DB.Save(&todo).Error
}
