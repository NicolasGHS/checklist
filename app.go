package main

import (
	"checklist/core/area"
	"checklist/core/db"
	"checklist/core/list"
	"checklist/core/models"
	"checklist/core/todo"
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
	return todo.AddTodo(name, description, list_id, today, deadlinePtr)
}

func (a *App) GetTodos() ([]models.Todo, error) {
	return todo.GetTodos()
}

func (a *App) GetTodoById(id uint) ([]models.Todo, error) {
	return todo.GetTodosByList(id)
}

func (a *App) GetTodosByList(id uint) ([]models.Todo, error) {
	return todo.GetTodosByList(id)
}

func (a *App) GetTodayTodos() ([]models.Todo, error) {
	return todo.GetTodayTodos()
}

func (a *App) ToggleTodo(id uint) error {
	return todo.ToggleTodo(id)
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
	return todo.UpdateTodo(id, name, description, list_id, today, deadlinePtr)
}

func (a *App) UpdateTodoList(id uint, listID uint) error {
	return todo.UpdateTodoList(id, listID)
}

// List
func (a *App) GetLists() ([]models.List, error) {
	return list.GetLists()
}

func (a *App) GetListBySlug(slug string) (models.List, error) {
	return list.GetListBySlug(slug)
}

func (a *App) AddList(name, description string) error {
	return list.AddList(name, description)
}

func (a *App) GetListsByArea(id uint) ([]models.List, error) {
	return list.GetListsByArea(id)
}

func (a *App) DeleteList(id uint) error {
	return list.DeleteList(id)
}

func (a *App) UpdateListArea(id uint, areaID uint) error {
	return list.UpdateListArea(id, areaID)
}

// Area
func (a *App) GetAreas() ([]models.Area, error) {
	return area.GetAreas()
}

func (a *App) AddArea(name string) error {
	return area.AddArea(name)
}
