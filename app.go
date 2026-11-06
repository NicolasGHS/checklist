package main

import (
	"checklist/core/api"
	"checklist/core/db"
	"checklist/core/models"
	"context"
	"errors"
	"io"
	"os"
	"path/filepath"
	"time"

	"github.com/wailsapp/wails/v3/pkg/application"
)

// App struct
type App struct{}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// ServiceStartup is called by Wails when the app starts
func (a *App) ServiceStartup(ctx context.Context, options application.ServiceOptions) error {
	return db.InitDB()
}

// parseDeadline turns an RFC3339 string into a time; "" means no deadline.
func parseDeadline(deadline string) (*time.Time, error) {
	if deadline == "" {
		return nil, nil
	}
	parsed, err := time.Parse(time.RFC3339, deadline)
	if err != nil {
		return nil, err
	}
	return &parsed, nil
}

// Todo
func (a *App) AddTodo(name, description string, list_id uint, today bool, deadline string) error {
	deadlinePtr, err := parseDeadline(deadline)
	if err != nil {
		return err
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

// UpdateTodo saves a task's fields. An empty deadline leaves the current one
// as is; use DeleteDeadline to remove it.
func (a *App) UpdateTodo(id uint, name string, description string, list_id uint, today bool, deadline string) error {
	deadlinePtr, err := parseDeadline(deadline)
	if err != nil {
		return err
	}
	return api.UpdateTodo(id, name, description, list_id, today, deadlinePtr)
}

// ScheduleTodo sets a task's deadline (RFC3339) and moves it out of Someday.
func (a *App) ScheduleTodo(id uint, deadline string) error {
	parsed, err := parseDeadline(deadline)
	if err != nil {
		return err
	}
	if parsed == nil {
		return errors.New("deadline is required")
	}
	return api.ScheduleTodo(id, *parsed)
}

// UnscheduleTodo clears a task's deadline and files it under Anytime, or
// Someday when someday is true.
func (a *App) UnscheduleTodo(id uint, someday bool) error {
	return api.UnscheduleTodo(id, someday)
}

// SetTodoCompleted marks a task done (true) or not done (false).
func (a *App) SetTodoCompleted(id uint, completed bool) error {
	return api.SetTodoCompleted(id, completed)
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

func (a *App) ReorderListTodos(ids []uint) error {
	return api.ReorderListTodos(ids)
}

func (a *App) ReorderTodayTodos(ids []uint) error {
	return api.ReorderTodayTodos(ids)
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

// DeleteList removes a list. With deleteTasks false its tasks move to the
// Inbox; with true they are deleted too.
func (a *App) DeleteList(id uint, deleteTasks bool) error {
	return api.DeleteList(id, deleteTasks)
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
	return application.Get().Dialog.OpenFile().
		SetTitle("Select Sync Folder").
		CanChooseFiles(false).
		CanChooseDirectories(true).
		CanCreateDirectories(true).
		PromptForSingleSelection()
}

// SetSyncFolder changes the database location. If no DB exists at the new
// location the current database is copied there so existing data is preserved.
// The DB connection is re-opened automatically so the app is ready to use
// immediately — no restart required. On failure the previous database is
// re-opened so the app keeps working.
func (a *App) SetSyncFolder(folder string) error {
	currentPath, err := db.GetAppDataPath()
	if err != nil {
		return err
	}

	// Close existing DB connection before copying the file.
	if db.DB != nil {
		if sqlDB, err := db.DB.DB(); err == nil {
			sqlDB.Close()
		}
	}

	// settings are only saved once everything else worked, so InitDB here
	// re-opens the database that was in use before
	restore := func(cause error) error {
		if err := db.InitDB(); err != nil {
			return errors.Join(cause, err)
		}
		return cause
	}

	if folder != "" {
		if err := os.MkdirAll(folder, os.ModePerm); err != nil {
			return restore(err)
		}
		newDbPath := filepath.Join(folder, "todos.db")
		if _, err := os.Stat(newDbPath); os.IsNotExist(err) {
			if err := copyFile(currentPath, newDbPath); err != nil {
				return restore(err)
			}
		}
	}

	s := db.LoadSettings()
	s.SyncFolder = folder
	if err := db.SaveSettings(s); err != nil {
		return restore(err)
	}

	return db.InitDB()
}

// copyFile copies src to dst via a temporary file, so an interrupted copy
// never leaves a half-written database at dst.
func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	tmp := dst + ".tmp"
	out, err := os.Create(tmp)
	if err != nil {
		return err
	}

	if _, err := io.Copy(out, in); err != nil {
		out.Close()
		os.Remove(tmp)
		return err
	}
	if err := out.Close(); err != nil {
		os.Remove(tmp)
		return err
	}
	return os.Rename(tmp, dst)
}
