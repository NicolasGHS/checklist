package main

import (
	"checklist/core/api"
	"checklist/core/db"
	"checklist/core/models"
	"context"
	"io"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
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

func (a *App) AddSubtask(name string, parent_id uint) error {
	return api.AddSubtask(name, parent_id)
}

func (a *App) GetSubtasks(parent_id uint) ([]models.Todo, error) {
	return api.GetSubtasks(parent_id)
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

func (a *App) GetArchivedTodos() ([]models.Todo, error) {
	return api.GetArchivedTodos()
}

func (a *App) GetArchivedTodosByList(id uint) ([]models.Todo, error) {
	return api.GetArchivedTodosByList(id)
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

func (a *App) DeleteTodo(id uint) error {
	return api.DeleteTodo(id)
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

func (a *App) GetCompletedTodos() ([]models.Todo, error) {
	return api.GetCompletedTodos()
}

// List
func (a *App) GetLists() ([]models.List, error) {
	return api.GetLists()
}

func (a *App) GetListBySlug(slug string) (models.List, error) {
	return api.GetListBySlug(slug)
}

func (a *App) AddList(name string) error {
	return api.AddList(name)
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

func (a *App) GetListsWithArchivedTodos() ([]models.List, error) {
	return api.GetListsWithArchivedTodos()
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

func (a *App) DeleteArea(id uint) error {
	return api.DeleteArea(id)
}

// Time

func (a *App) GetNextSevenDays() []time.Time {
	return api.GetNextSevenDays()
}

// Note

func (a *App) CreateNote(title, content string) (*models.Note, error) {
	return api.CreateNote(title, content)
}

func (a *App) GetAllNotes() ([]models.Note, error) {
	return api.GetAllNotes()
}

func (a *App) GetNoteByID(id uint) (*models.Note, error) {
	return api.GetNoteByID(id)
}

func (a *App) UpdateNote(id uint, title, content string) (*models.Note, error) {
	return api.UpdateNote(id, title, content)
}

func (a *App) DeleteNote(id uint) error {
	return api.DeleteNote(id)
}

// Sync / Settings

func (a *App) GetSyncFolder() string {
	return db.LoadSettings().SyncFolder
}

// SelectSyncFolder opens a native directory picker and returns the chosen path.
func (a *App) SelectSyncFolder() (string, error) {
	folder, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select Sync Folder",
	})
	return folder, err
}

// SetSyncFolder changes the database location. If no DB exists at the new
// location the current database is copied there so existing data is preserved.
// The DB connection is re-opened automatically so the app is ready to use
// immediately — no restart required.
func (a *App) SetSyncFolder(folder string) error {
	currentPath, err := db.GetAppDataPath()
	if err != nil {
		return err
	}

	// Close existing DB connection before moving files.
	if db.DB != nil {
		sqlDB, err := db.DB.DB()
		if err == nil {
			sqlDB.Close()
		}
	}

	if folder != "" {
		if err := os.MkdirAll(folder, os.ModePerm); err != nil {
			return err
		}
		newDbPath := filepath.Join(folder, "todos.db")
		if _, err := os.Stat(newDbPath); os.IsNotExist(err) {
			if err := copyFile(currentPath, newDbPath); err != nil {
				return err
			}
		}
	}

	s := db.LoadSettings()
	s.SyncFolder = folder
	if err := db.SaveSettings(s); err != nil {
		return err
	}

	return db.InitDB()
}

func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, in)
	return err
}
