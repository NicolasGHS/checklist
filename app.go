package main

import (
	"checklist/core/api"
	"checklist/core/db"
	"checklist/core/models"
	"context"
	"log"
	"time"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	err := db.InitDB()

	if err != nil {
		log.Fatal(err)
	}
}

// Todo
func (a *App) AddTodo(name, description string, list_id uint, today bool, deadline string) error {
	var deadlinePtr *time.Time
	if deadline != "" {
		parsedTime, err := time.Parse(time.RFC3339, deadline)
		if err != nil {
			return err
		}
		deadlinePtr = &parsedTime
	}
	return api.AddTodo(name, description, list_id, today, deadlinePtr)
}

func (a *App) GetTodos() ([]models.Todo, error) {
	return api.GetTodos()
}

func (a *App) GetTodoById(id uint) ([]models.Todo, error) {
	return api.GetTodosByList(id)
}

func (a *App) GetTodosByList(id uint) ([]models.Todo, error) {
	return api.GetTodosByList(id)
}

func (a *App) GetTodayTodos() ([]models.Todo, error) {
	return api.GetTodayTodos()
}

func (a *App) GetTodosByDeadline(date time.Time) ([]models.Todo, error) {
	return api.GetTodosByDeadline(date)
}

func (a *App) GetTodayCount() (int, error) {
	return api.GetTodayCount()
}

func (a *App) GetListCount(id uint) (int, error) {
	return api.GetListCount(id)
}

func (a *App) ToggleTodo(id uint) error {
	return api.ToggleTodo(id)
}

func (a *App) UpdateTodo(id uint, name string, description string, list_id uint, today bool, deadline string) error {
	var deadlinePtr *time.Time
	if deadline != "" {
		parsedTime, err := time.Parse(time.RFC3339, deadline)
		if err != nil {
			return err
		}
		deadlinePtr = &parsedTime
	}
	return api.UpdateTodo(id, name, description, list_id, today, deadlinePtr)
}

func (a *App) DeleteDeadline(id uint) (models.Todo, error) {
	return api.DeleteDeadline(id)
}

func (a *App) UpdateTodoList(id uint, listID uint) error {
	return api.UpdateTodoList(id, listID)
}

func (a *App) CalculateRemainingTime(id uint) (*int, error) {
	return api.CalculateDaysLeft(id)
}

// List
func (a *App) GetLists() ([]models.List, error) {
	return api.GetLists()
}

func (a *App) GetListBySlug(slug string) (models.List, error) {
	return api.GetListBySlug(slug)
}

func (a *App) AddList(name, description string) error {
	return api.AddList(name, description)
}

func (a *App) AddListWithArea(name, description string, areaId int32) error {
	return api.AddListWithArea(name, description, areaId)
}

func (a *App) GetListsByArea(id uint) ([]models.List, error) {
	return api.GetListsByArea(id)
}

func (a *App) GetListsWithoutArea() ([]models.List, error) {
	return api.GetListsWithoutArea()
}

func (a *App) DeleteList(id uint) error {
	return api.DeleteList(id)
}

func (a *App) UpdateListArea(id uint, areaID uint) error {
	return api.UpdateListArea(id, areaID)
}

// Area
func (a *App) GetAreas() ([]models.Area, error) {
	return api.GetAreas()
}

func (a *App) AddArea(name string) error {
	return api.AddArea(name)
}

// Time

func (a *App) GetNextSevenDays() []time.Time {
	return api.GetNextSevenDays()
}
