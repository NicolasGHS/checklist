package api

import (
	"checklist/core/db"
	"checklist/core/models"
	"checklist/core/repository"
	"sort"
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
	// "today" is the local calendar day, not the UTC one
	startOfDay, endOfDay := localDayBounds(time.Now())

	unfinishedTodos, err := repository.GetTodosDueBetween(startOfDay, endOfDay)
	if err != nil {
		return nil, err
	}

	overdueTodos, err := repository.GetOverdueTodos(startOfDay)
	if err != nil {
		return nil, err
	}

	result := append(unfinishedTodos, overdueTodos...)

	// manually placed tasks first in their order; unplaced ones (0) keep the
	// default order (due today, then overdue) after them
	sort.SliceStable(result, func(i, j int) bool {
		a, b := result[i].TodayPosition, result[j].TodayPosition
		if (a == 0) != (b == 0) {
			return b == 0
		}
		return a < b
	})

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
	startOfDay, endOfDay := localDayBounds(date)

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

// localDayBounds returns the first and last instant of t's local calendar day.
func localDayBounds(t time.Time) (time.Time, time.Time) {
	local := t.In(time.Local)
	start := time.Date(local.Year(), local.Month(), local.Day(), 0, 0, 0, 0, time.Local)
	end := time.Date(local.Year(), local.Month(), local.Day(), 23, 59, 59, 999999999, time.Local)
	return start, end
}

// ScheduleTodo gives a task a deadline and moves it out of Someday.
func ScheduleTodo(id uint, deadline time.Time) error {
	return repository.ScheduleTodo(id, deadline)
}

// UnscheduleTodo clears a task's deadline and files it under Anytime, or
// Someday when someday is true.
func UnscheduleTodo(id uint, someday bool) error {
	return repository.UnscheduleTodo(id, someday)
}

// SetTodoCompleted sets a task's completed state (idempotent, unlike ToggleTodo).
func SetTodoCompleted(id uint, completed bool) error {
	return repository.SetTodoCompleted(id, completed)
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

	return repository.SaveTodo(&todo)
}

func UpdateTodoList(id uint, listID uint) error {
	todo, err := repository.GetTodoById(id)
	if err != nil {
		return err
	}

	todo.ListID = listID
	todo.Position = 0 // goes to the bottom of the new list
	return repository.SaveTodo(&todo)
}

// ReorderListTodos stores the manual order of tasks within a list.
func ReorderListTodos(ids []uint) error {
	return repository.SetTodoPositions("position", ids)
}

// ReorderTodayTodos stores the manual order of tasks on the Today page.
func ReorderTodayTodos(ids []uint) error {
	return repository.SetTodoPositions("today_position", ids)
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

func DeleteTodo(id uint) error {
	return repository.DeleteTodo(id)
}

func GetCompletedTodos() ([]models.Todo, error) {
	response, err := repository.GetCompletedTodos()
	if err != nil {
		return nil, err
	}

	return response, nil

}
