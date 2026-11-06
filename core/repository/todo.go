package repository

import (
	"checklist/core/db"
	"checklist/core/models"
	"time"

	"gorm.io/gorm"
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

	// position is NULL on rows from before the column existed: treat as 0 (unplaced)
	result := db.DB.Where("list_id = ? AND archive = 0 AND parent_id IS NULL", id).
		Order("completed asc, COALESCE(position, 0) = 0 asc, position asc, id asc").
		Find(&todos)
	if result.Error != nil {
		return nil, result.Error
	}

	return todos, nil
}

// GetTodosDueBetween returns top-level tasks whose deadline falls in
// [start, end]. Deadlines are stored in UTC, and SQLite compares them as
// text, so the bounds are converted to UTC to keep the comparison valid.
func GetTodosDueBetween(start, end time.Time) ([]models.Todo, error) {
	var todos []models.Todo

	result := db.DB.Where("deadline >= ? AND deadline <= ? AND parent_id IS NULL", start.UTC(), end.UTC()).
		Find(&todos)
	if result.Error != nil {
		return nil, result.Error
	}

	return todos, nil
}

// GetOverdueTodos returns unfinished top-level tasks due before the given time.
func GetOverdueTodos(before time.Time) ([]models.Todo, error) {
	var todos []models.Todo

	result := db.DB.Where("completed = 0 AND deadline < ? AND parent_id IS NULL", before.UTC()).
		Find(&todos)
	if result.Error != nil {
		return nil, result.Error
	}

	return todos, nil
}

func GetTodosByDeadline(start, end time.Time) ([]models.Todo, error) {
	var todos []models.Todo

	result := db.DB.Where("deadline >= ? AND deadline <= ? AND parent_id IS NULL", start.UTC(), end.UTC()).Order("completed asc").Find(&todos)

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

// UpdateTodo writes name, description, list and today flag as given, so they
// can be cleared. A nil deadline leaves the stored deadline untouched; use
// DeleteDeadline to remove it.
func UpdateTodo(id uint, name string, description string, list_id uint, today bool, deadline *time.Time) error {
	fields := map[string]any{
		"name":        name,
		"description": description,
		"list_id":     list_id,
		"today":       today,
	}
	if deadline != nil {
		fields["deadline"] = *deadline
	}
	return db.DB.Model(&models.Todo{}).Where("id = ?", id).Updates(fields).Error
}

// ScheduleTodo sets a task's deadline and takes it out of Someday.
func ScheduleTodo(id uint, deadline time.Time) error {
	return db.DB.Model(&models.Todo{}).Where("id = ?", id).
		Updates(map[string]any{"deadline": deadline, "archive": false}).Error
}

// UnscheduleTodo removes a task's deadline and puts it in Anytime
// (someday=false) or Someday (someday=true).
func UnscheduleTodo(id uint, someday bool) error {
	return db.DB.Model(&models.Todo{}).Where("id = ?", id).
		Updates(map[string]any{"deadline": nil, "today_position": 0, "archive": someday}).Error
}

func DeleteDeadline(id uint) (models.Todo, error) {
	var todo models.Todo

	// leaving Today drops the task's spot there, so it re-enters at the bottom
	result := db.DB.Model(&models.Todo{}).Where("id = ?", id).
		Updates(map[string]any{"deadline": nil, "today_position": 0})
	if result.Error != nil {
		return models.Todo{}, result.Error
	}

	_ = db.DB.Where("id = ?", id).Find(&todo)

	return todo, nil
}

// SetTodoCompleted marks a task done or not done, stamping CompletedAt.
func SetTodoCompleted(id uint, completed bool) error {
	completedAt := time.Time{}
	if completed {
		completedAt = time.Now()
	}
	return db.DB.Model(&models.Todo{}).Where("id = ?", id).
		Updates(map[string]any{"completed": completed, "completed_at": completedAt}).Error
}

func DeleteTodo(id uint) error {
	return db.DB.Where("id = ? OR parent_id = ?", id, id).Delete(&models.Todo{}).Error
}

func SaveTodo(todo *models.Todo) error {
	return db.DB.Save(todo).Error
}

// SetTodoPositions writes 1-based positions into column ("position" or
// "today_position") following the order of ids, in one transaction.
func SetTodoPositions(column string, ids []uint) error {
	return db.DB.Transaction(func(tx *gorm.DB) error {
		for i, id := range ids {
			if err := tx.Model(&models.Todo{}).Where("id = ?", id).
				Update(column, i+1).Error; err != nil {
				return err
			}
		}
		return nil
	})
}
