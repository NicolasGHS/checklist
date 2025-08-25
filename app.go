package main

import (
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

func (a *App) AddTodo(name, description string) error {
	return todo.AddTodo(name, description)
}

func (a *App) GetTodos() ([]models.Todo, error) {
	return todo.GetTodos()
}

func (a *App) AddList(name, description string) error {
	return list.AddList(name, description)
}

func (a *App) GetLists() ([]models.List, error) {
	return list.GetLists()
}
