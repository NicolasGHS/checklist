package main

import (
	"checklist/core/area"
	"checklist/core/db"
	"checklist/core/list"
	"checklist/core/models"
	"checklist/core/todo"
	"context"
	"log"
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
func (a *App) AddTodo(name, description string, list_id uint) error {
	return todo.AddTodo(name, description, list_id)
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

func (a *App) ToggleTodo(id uint) error {
	return todo.ToggleTodo(id)
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

// Area
func (a *App) GetAreas() ([]models.Area, error) {
	return area.GetAreas()
}

func (a *App) AddArea(name string) error {
	return area.AddArea(name)
}
