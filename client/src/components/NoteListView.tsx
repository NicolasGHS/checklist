import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { NotesList } from "./NotesList";
import { models } from "wailsjs/go/models";
import { NoteEditForm } from "./NoteEditForm";

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
        <NoteEditForm
          value={currentNote}
          setValue={setCurrentNote}
          onSave={handleSaveNote}
          onCancel={handleCancelNote}
          saveLabel="Add Note"
        />
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
