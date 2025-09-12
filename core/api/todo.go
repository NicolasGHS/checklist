package api

import (
	"checklist/core/db"
	"checklist/core/models"
	"checklist/core/utils"
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
	var result []models.Todo

	todayDate := time.Now()

	_ = db.DB.Find(&todos)

	incompoletedTasks, err := GetIncompletedTodayTodos(todayDate.String())

	if err != nil {
		return nil, err
	}

	result = append(result, incompoletedTasks...)

	for _, todo := range todos {
		if utils.IsToday(todo.Deadline) {
			result = append(result, todo)
		}
	}
	return result, nil
}

func GetTodayCount() (int, error) {
	var todos []models.Todo

	todos, err := GetTodayTodos()

	if err != nil {
		return 0, err
	}

	number := len(todos)
	return number, nil
}

func GetListCount(id uint) (int, error) {
	var todos []models.Todo
	var result []models.Todo

	todos, err := GetTodosByList(id)
	if err != nil {
		return 0, err
	}

	for _, todo := range todos {
		if !todo.Completed {
			result = append(result, todo)
		}
	}

	number := len(result)
	return number, nil
}

func GetIncompletedTodayTodos(date string) ([]models.Todo, error) {
	var todos []models.Todo

	result := db.DB.Where("completed = 0 AND deadline <= ?", date).Find(&todos)
	if result.Error != nil {
		return nil, result.Error
	}
	return todos, nil
}

func GetTodosByDeadline(date time.Time) ([]models.Todo, error) {
	var todos []models.Todo

	// Set the date range to cover the entire day
	startOfDay := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, date.Location())
	endOfDay := time.Date(date.Year(), date.Month(), date.Day(), 23, 59, 59, 999999999, date.Location())

	result := db.DB.Where("deadline >= ? AND deadline <= ?", startOfDay, endOfDay).Order("completed asc").Find(&todos)
	if result.Error != nil {
		return nil, result.Error
	}
	return todos, nil
}

func AddTodo(name, description string, list_id uint, today bool, deadline *time.Time) error {
	return db.DB.Create(&models.Todo{Name: name, Completed: false, Description: description, ListID: list_id, Today: today, Deadline: deadline}).Error
}

func UpdateTodo(id uint, name string, description string, list_id uint, today bool, deadline *time.Time) error {
	result := db.DB.Model(&models.Todo{}).Where("id = ?", id).Updates(&models.Todo{Name: name, Description: description, ListID: list_id, Today: today, Deadline: deadline})

	return result.Error
}

func DeleteDeadline(id uint) (models.Todo, error) {
	var todo models.Todo

	result := db.DB.Model(&models.Todo{}).Where("id = ?", id).Update("deadline", nil)
	if result.Error != nil {
		return models.Todo{}, result.Error
	}

	_ = db.DB.Where("id = ?", id).Find(&todo)

	return todo, result.Error
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

func CalculateDaysLeft(id uint) (*int, error) {
	var t models.Todo

	if err := db.DB.First(&t, id).Error; err != nil {
		return nil, err
	}
	if t.Deadline == nil {
		return nil, nil
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

	return &days, nil
}
