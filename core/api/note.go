package api

import (
	"checklist/core/db"
	"checklist/core/models"
	"checklist/core/repository"
)

func CreateNote(title, content string) (*models.Note, error) {
	repo := repository.NewNoteRepository(db.DB)
	note := &models.Note{
		Title:   title,
		Content: content,
	}
	err := repo.Create(note)
	return note, err
}

func GetAllNotes() ([]models.Note, error) {
	repo := repository.NewNoteRepository(db.DB)
	return repo.GetAll()
}

func GetNoteByID(id uint) (*models.Note, error) {
	repo := repository.NewNoteRepository(db.DB)
	return repo.GetByID(id)
}

func UpdateNote(id uint, title, content string) (*models.Note, error) {
	repo := repository.NewNoteRepository(db.DB)
	note, err := repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	note.Title = title
	note.Content = content

	err = repo.Update(note)
	return note, err
}

func DeleteNote(id uint) error {
	repo := repository.NewNoteRepository(db.DB)
	return repo.Delete(id)
}
