import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Book, Trash2 } from "lucide-react";
import { GetAllNotes, CreateNote, DeleteNote } from "../../wailsjs/go/main/App";
import { models } from "../../wailsjs/go/models";
import { NotesList } from "./NotesList";

export const Notebar: React.FC = () => {
  const [notes, setNotes] = useState<models.Note[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [selectedNote, setSelectedNote] = useState<models.Note | null>(null);

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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Book className="h-4 w-4" />
        </Button>
      </SheetTrigger>
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
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">
                      {selectedNote.title}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteNote(selectedNote.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(selectedNote.createdAt as any).toLocaleString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedNote.content}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            // List View
            <>
              {/* New Note Box */}
              <div onMouseLeave={handleSaveNote}>
                <Textarea
                  placeholder="Start typing your note here..."
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>
              <NotesList
                notes={notes}
                handleDeleteNote={handleDeleteNote}
                onNoteClick={handleNoteClick}
              />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
