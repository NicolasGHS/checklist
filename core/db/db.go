package db

import (
	"checklist/core/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() error {
	database, err := gorm.Open(sqlite.Open("todos.db"), &gorm.Config{})
	if err != nil {
		return err
	}

	database.AutoMigrate(&models.Todo{})
	DB = database
	return nil
}

func AddTodo(name, description string) error {
	return DB.Create(&models.Todo{Name: name, Completed: false, Description: description}).Error
}

func GetTodos() ([]models.Todo, error) {
	var todos []models.Todo

	result := DB.Find(&todos)
	return todos, result.Error
}
