import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { NotesList } from "./NotesList";
import { models } from "wailsjs/go/models";

type NoteListViewProps = {
  notes: models.Note[];
  isCreatingNote: boolean;
  handleSaveNote: () => void;
  currentNote: string;
  setCurrentNote: (value: string) => void;
  handleCancelNote: () => void;
  handleNewNoteClick: () => void;
  handleDeleteNote: (id: number) => void;
  handleNoteClick: (note: models.Note) => void;
};

export const NoteListView = ({
  notes,
  isCreatingNote,
  handleSaveNote,
  currentNote,
  setCurrentNote,
  handleCancelNote,
  handleNewNoteClick,
  handleDeleteNote,
  handleNoteClick,
}: NoteListViewProps) => {
  return (
    <>
      {isCreatingNote ? (
        <div onMouseLeave={handleSaveNote} className="space-y-2">
          <Textarea
            placeholder="Start typing your note here... (Markdown supported)"
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            rows={6}
            className="resize-none"
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelNote}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleNewNoteClick}
          className="w-full"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      )}
      <NotesList
        notes={notes}
        handleDeleteNote={handleDeleteNote}
        onNoteClick={handleNoteClick}
      />
    </>
  );
};
