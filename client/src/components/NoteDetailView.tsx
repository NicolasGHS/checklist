import { Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { models } from "wailsjs/go/models";

type NoteDetailsViewProps = {
  isEditingNote: boolean;
  editedNoteContent: string;
  setEditedNoteContent: (value: string) => void;
  handleSaveEditedNote: () => void;
  handleCancelEdit: () => void;
  selectedNote: models.Note | null;
  handleEditNote: () => void;
  handleDeleteNote: (id: number) => void;
};

export const NoteDetailView = ({
  isEditingNote,
  editedNoteContent,
  setEditedNoteContent,
  handleSaveEditedNote,
  handleCancelEdit,
  selectedNote,
  handleEditNote,
  handleDeleteNote,
}: NoteDetailsViewProps) => {
  return (
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
              <CardTitle className="text-xl">{selectedNote?.title}</CardTitle>
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
                  onClick={() =>
                    selectedNote && handleDeleteNote(selectedNote.id)
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(selectedNote?.createdAt as any).toLocaleString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedNote?.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
