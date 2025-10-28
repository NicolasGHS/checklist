import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { models } from "wailsjs/go/models";

type NotesListProps = {
  notes: models.Note[];
  handleDeleteNote: (id: number) => void;
};

export const NotesList = ({ notes, handleDeleteNote }: NotesListProps) => {
  return (
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
                  <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  );
};
