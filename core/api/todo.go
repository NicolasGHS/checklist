package api

import (
	"checklist/core/db"
	"checklist/core/models"
	"checklist/core/repository"
	"time"
)

func GetTodos() ([]models.Todo, error) {
	response, err := repository.GetTodos()
	if err != nil {
		return nil, err
	}

	return response, nil
}

func GetTodosByList(id uint) ([]models.Todo, error) {
	response, err := repository.GetTodosByList(id)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func GetTodayTodos() ([]models.Todo, error) {
	unfinishedTodos, err := repository.GetUnfinishedTodayTodos()
	if err != nil {
		return nil, err
	}

	overdueTodos, err := repository.GetOverdueTodayTodos()
	if err != nil {
		return nil, err
	}

	result := append(unfinishedTodos, overdueTodos...)

	return result, nil
}

func GetTodayCount() (int, error) {
	var todos []models.Todo

	todos, err := GetTodayTodos()

	if err != nil {
		return 0, err
	}

	count := 0
	for _, todo := range todos {
		if !todo.Completed {
			count++
		}
	}

	return count, nil
}

func GetListCount(id uint) (int, error) {
	todos, err := GetTodosByList(id)
	if err != nil {
		return 0, err
	}

	count := 0
	for _, todo := range todos {
		if !todo.Completed {
			count++
		}
	}

	return count, nil
}

func GetTodosByDeadline(date time.Time) ([]models.Todo, error) {
	// TODO: separate time logic
	loc := time.Local
	localDate := date.In(loc)
	startOfDay := time.Date(localDate.Year(), localDate.Month(), localDate.Day(), 0, 0, 0, 0, loc)
	endOfDay := time.Date(localDate.Year(), localDate.Month(), localDate.Day(), 23, 59, 59, 999999999, loc)

	response, err := repository.GetTodosByDeadline(startOfDay, endOfDay)
	if err != nil {
		return nil, err
	}
	return response, nil
}

func GetArchivedTodos() ([]models.Todo, error) {
	response, err := repository.GetArchivedTodos()
	if err != nil {
		return nil, err
	}
	return response, nil
}

func GetArchivedTodosByList(id uint) ([]models.Todo, error) {
	response, err := repository.GetArchivedTodosByList(id)

	if err != nil {
		return nil, err
	}

	return response, nil
}

func AddTodo(name, description string, list_id uint, today bool, deadline *time.Time) error {
	response := repository.AddTodo(name, description, list_id, today, deadline)
	if response != nil {
		return response
	}
	return nil
}

func AddSubtask(name string, parent_id uint) error {
	response := repository.AddSubtask(name, parent_id)
	if response != nil {
		return response
	}
	return nil
}

func GetSubtasks(parent_id uint) ([]models.Todo, error) {
	response, err := repository.GetSubtasks(parent_id)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func UpdateTodo(id uint, name string, description string, list_id uint, today bool, deadline *time.Time) error {
	response := repository.UpdateTodo(id, name, description, list_id, today, deadline)
	if response != nil {
		return response
	}
	return nil
}

func DeleteDeadline(id uint) (models.Todo, error) {
	response, err := repository.DeleteDeadline(id)
	if err != nil {
		return models.Todo{}, err
	}
	return response, nil
}

func ToggleTodo(id uint) error {
	todo, err := repository.GetTodoById(id)
	if err != nil {
		return err
	}

	todo.Completed = !todo.Completed

	if todo.Completed {
		now := time.Now()
		todo.CompletedAt = now
	} else {
		todo.CompletedAt = time.Time{}
	}

	// TODO: remove save function
	db.DB.Save(&todo)
	return nil
}

func UpdateTodoList(id uint, listID uint) error {
	todo, err := repository.GetTodoById(id)
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

	loc := time.Local
	now := time.Now().In(loc)
	dl := t.Deadline.In(loc)

	y1, m1, d1 := now.Date()
	y2, m2, d2 := dl.Date()

	start := time.Date(y1, m1, d1, 0, 0, 0, 0, loc)
	end := time.Date(y2, m2, d2, 0, 0, 0, 0, loc)

	days := int(end.Sub(start).Hours() / 24)

	return &days, nil
}

func GetCompletedTodos() ([]models.Todo, error) {
	response, err := repository.GetCompletedTodos()
	if err != nil {
		return nil, err
	}

	return response, nil

}
