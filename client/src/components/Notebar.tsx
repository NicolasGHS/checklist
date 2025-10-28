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

export const Notebar: React.FC = () => {
  const [notes, setNotes] = useState<models.Note[]>([]);
  const [currentNote, setCurrentNote] = useState("");

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
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
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
          <SheetTitle>Notes</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* New Note Box */}
          <div onMouseLeave={handleSaveNote}>
            <Textarea
              placeholder="Start typing your note here...&#10;First line will be the title"
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          {/* Notes List */}
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-3">
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No notes yet. Start typing above!
                </p>
              ) : (
                notes.map((note) => (
                  <Card key={note.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base font-semibold">
                          {note.title}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 -mt-1"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(note.createdAt as any).toLocaleString()}
                      </p>
                    </CardHeader>
                    {note.content && (
                      <CardContent className="pt-0">
                        <p className="text-sm whitespace-pre-wrap">
                          {note.content}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};
