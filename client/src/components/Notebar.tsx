import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import {
  GetAllNotes,
  CreateNote,
  DeleteNote,
  UpdateNote,
} from "../../wailsjs/go/main/App";
import { models } from "../../wailsjs/go/models";
import { NotebarButton } from "./NotebarButton";
import { NoteListView } from "./NoteListView";
import { NoteDetailView } from "./NoteDetailView";

export const Notebar: React.FC = () => {
  const [notes, setNotes] = useState<models.Note[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [selectedNote, setSelectedNote] = useState<models.Note | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editedNoteContent, setEditedNoteContent] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const allNotes = await GetAllNotes();
      setNotes(allNotes || []);
    } catch (error) {
      console.error("Failed to load notes:", error);
    }
  };

  const handleSaveNote = async () => {
    if (currentNote.trim()) {
      const lines = currentNote.trim().split("\n");
      const title = lines[0] || "Untitled Note";
      const content = lines.slice(1).join("\n");

      try {
        await CreateNote(title, content);
        setCurrentNote("");
        setIsCreatingNote(false);
        await loadNotes();
      } catch (error) {
        console.error("Failed to save note:", error);
      }
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await DeleteNote(id);
      await loadNotes();
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleNoteClick = (note: models.Note) => {
    setSelectedNote(note);
  };

  const handleBackToList = () => {
    setSelectedNote(null);
  };

  const handleNewNoteClick = () => {
    setIsCreatingNote(true);
  };

  const handleCancelNote = () => {
    setIsCreatingNote(false);
    setCurrentNote("");
  };

  const handleEditNote = () => {
    if (selectedNote) {
      setEditedNoteContent(`${selectedNote.title}\n${selectedNote.content}`);
      setIsEditingNote(true);
    }
  };

  const handleSaveEditedNote = async () => {
    if (selectedNote && editedNoteContent.trim()) {
      const lines = editedNoteContent.trim().split("\n");
      const title = lines[0] || "Untitled Note";
      const content = lines.slice(1).join("\n");

      try {
        await UpdateNote(selectedNote.id, title, content);
        setIsEditingNote(false);
        setEditedNoteContent("");
        await loadNotes();
        const updatedNotes = await GetAllNotes();
        const updatedNote = updatedNotes?.find((n) => n.id === selectedNote.id);
        if (updatedNote) {
          setSelectedNote(updatedNote);
        }
      } catch (error) {
        console.error("Failed to update note:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditingNote(false);
    setEditedNoteContent("");
  };

  return (
    <Sheet>
      <NotebarButton />
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {selectedNote ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToList}
                  className="h-8 w-8"
                >
                  <span className="text-lg">←</span>
                </Button>
                <span>Note Details</span>
              </div>
            ) : (
              "Notes"
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {selectedNote ? (
            <NoteDetailView
              isEditingNote={isEditingNote}
              editedNoteContent={editedNoteContent}
              setEditedNoteContent={setEditedNoteContent}
              handleSaveEditedNote={handleSaveEditedNote}
              handleCancelEdit={handleCancelEdit}
              selectedNote={selectedNote}
              handleEditNote={handleEditNote}
              handleDeleteNote={handleDeleteNote}
            />
          ) : (
            <NoteListView
              notes={notes}
              isCreatingNote={isCreatingNote}
              handleSaveNote={handleSaveNote}
              currentNote={currentNote}
              setCurrentNote={setCurrentNote}
              handleCancelNote={handleCancelNote}
              handleNewNoteClick={handleNewNoteClick}
              handleDeleteNote={handleDeleteNote}
              handleNoteClick={handleNoteClick}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
