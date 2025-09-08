package todo

import (
	"checklist/core/db"
	"checklist/core/models"
	"math"
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

func GetTodayTodos() ([]models.Todo, error) {
	var todos []models.Todo

	_ = db.DB.Where("today = 1").Order("completed asc").Find(&todos)
	return todos, nil
}

func AddTodo(name, description string, list_id uint, today bool, deadline *time.Time) error {
	return db.DB.Create(&models.Todo{Name: name, Completed: false, Description: description, ListID: list_id, Today: today, Deadline: deadline}).Error
}

func UpdateTodo(id uint, name string, description string, list_id uint, today bool, deadline *time.Time) error {
	result := db.DB.Model(&models.Todo{}).Where("id = ?", id).Updates(&models.Todo{Name: name, Description: description, ListID: list_id, Today: today, Deadline: deadline})

	return result.Error
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

func CalculateDaysLeft(id uint) (int, error) {
	var t models.Todo

	// Gebruik First in plaats van Find; Find geeft geen error bij "niet gevonden".
	if err := db.DB.First(&t, id).Error; err != nil {
		return 0, err
	}
	if t.Deadline == nil {
		return 0, nil
	}

	loc := time.Local // of een expliciete locatie indien je die opslaat
	now := time.Now().In(loc)
	dl := t.Deadline.In(loc)

	// Strip tijdcomponent
	y1, m1, d1 := now.Date()
	y2, m2, d2 := dl.Date()

	start := time.Date(y1, m1, d1, 0, 0, 0, 0, loc)
	end := time.Date(y2, m2, d2, 0, 0, 0, 0, loc)

	days := int(end.Sub(start).Hours() / 24)

	return days, nil
}
