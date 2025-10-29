import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Trash2, Plus, Pencil } from "lucide-react";
import {
  GetAllNotes,
  CreateNote,
  DeleteNote,
  UpdateNote,
} from "../../wailsjs/go/main/App";
import { models } from "../../wailsjs/go/models";
import { NotesList } from "./NotesList";
import { NotebarButton } from "./NotebarButton";
import { NoteListView } from "./NoteListView";

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
            // Note Detail View
            <div className="space-y-4">
              {isEditingNote ? (
                // Edit Mode
                <div className="space-y-2">
                  <Textarea
                    placeholder="Edit your note... (Markdown supported)"
                    value={editedNoteContent}
                    onChange={(e) => setEditedNoteContent(e.target.value)}
                    rows={12}
                    className="resize-none"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEditedNote} className="flex-1">
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">
                        {selectedNote.title}
                      </CardTitle>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleEditNote}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteNote(selectedNote.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(selectedNote.createdAt as any).toLocaleString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {selectedNote.content}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
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
