import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { models } from "wailsjs/go/models";
import { NoteEditForm } from "./NoteEditForm";

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
        <NoteEditForm
          value={editedNoteContent}
          setValue={setEditedNoteContent}
          onSave={handleSaveEditedNote}
          onCancel={handleCancelEdit}
          saveLabel="Save Changes"
        />
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
