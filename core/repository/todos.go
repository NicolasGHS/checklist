package repository

import (
	"checklist/core/db"
	"checklist/core/models"
	"time"
)

func GetTodos() ([]models.Todo, error) {
	var todos []models.Todo

	result := db.DB.Find(&todos)
	if result.Error != nil {
		return nil, result.Error
	}

	return todos, nil
}

func GetTodoById(id uint) (models.Todo, error) {
	var todo models.Todo

	result := db.DB.Where("id = ?", id).First(&todo)
	if result.Error != nil {
		return models.Todo{}, result.Error
	}

	return todo, nil
}

func GetTodosByList(id uint) ([]models.Todo, error) {
	var todos []models.Todo

	result := db.DB.Where("list_id = ? AND archive = 0 AND parent_id IS NULL", id).Order("completed asc").Find(&todos)
	if result.Error != nil {
		return nil, result.Error
	}

	return todos, nil
}

func GetUnfinishedTodayTodos() ([]models.Todo, error) {
	var unfinishedTodos []models.Todo

	result := db.DB.Where("DATE(deadline) = DATE(?) AND parent_id IS NULL", time.Now()).Find(&unfinishedTodos).Error
	if result != nil {
		return nil, result
	}

	return unfinishedTodos, nil
}

func GetOverdueTodayTodos() ([]models.Todo, error) {
	var overdueTodos []models.Todo

	result := db.DB.Where("completed = 0 AND deadline < DATE(?) AND parent_id IS NULL", time.Now()).Find(&overdueTodos).Error
	if result != nil {
		return nil, result
	}

	return overdueTodos, nil
}

func GetTodosByDeadline(start, end time.Time) ([]models.Todo, error) {
	var todos []models.Todo

	result := db.DB.Where("deadline >= ? AND deadline <= ? AND parent_id IS NULL", start, end).Order("completed asc").Find(&todos)

	if result.Error != nil {
		return nil, result.Error
	}

	return todos, nil
}

func GetArchivedTodos() ([]models.Todo, error) {
	var todos []models.Todo

	result := db.DB.Where("archive = 1 AND parent_id IS NULL").Find(&todos)

	if result.Error != nil {
		return nil, result.Error
	}
	return todos, nil
}

func GetArchivedTodosByList(id uint) ([]models.Todo, error) {
	var todos []models.Todo

	result := db.DB.Where("archive = 1 AND list_id = ? AND parent_id IS NULL", id).Find(&todos)

	if result.Error != nil {
		return nil, result.Error
	}

	return todos, nil
}

func GetSubtasks(parent_id uint) ([]models.Todo, error) {
	var subtasks []models.Todo

	result := db.DB.Where("parent_id = ?", parent_id).Order("completed asc, created_at asc").Find(&subtasks)
	if result.Error != nil {
		return nil, result.Error
	}

	return subtasks, nil
}

func GetCompletedTodos() ([]models.Todo, error) {
	var todos []models.Todo

	result := db.DB.Where("completed = 1 AND parent_id IS NULL").Order("completed_at DESC").Find(&todos)
	if result.Error != nil {
		return nil, result.Error
	}
	return todos, nil
}

func AddTodo(name, description string, list_id uint, today bool, deadline *time.Time) error {
	result := db.DB.Create(&models.Todo{Name: name, Completed: false, Description: description, ListID: list_id, Today: today, Deadline: deadline}).Error
	if result != nil {
		return result
	}
	return nil
}

func AddSubtask(name string, parent_id uint) error {
	result := db.DB.Create(&models.Todo{Name: name, Completed: false, ParentID: &parent_id}).Error
	if result != nil {
		return result
	}
	return nil
}

func UpdateTodo(id uint, name string, description string, list_id uint, today bool, deadline *time.Time) error {
	result := db.DB.Model(&models.Todo{}).Where("id = ?", id).Updates(&models.Todo{Name: name, Description: description, ListID: list_id, Today: today, Deadline: deadline})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func DeleteDeadline(id uint) (models.Todo, error) {
	var todo models.Todo

	result := db.DB.Model(&models.Todo{}).Where("id = ?", id).Update("deadline", nil)
	if result.Error != nil {
		return models.Todo{}, result.Error
	}

	_ = db.DB.Where("id = ?", id).Find(&todo)

	return todo, nil
}
