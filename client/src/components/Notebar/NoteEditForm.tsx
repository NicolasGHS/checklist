import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

type NoteEditFormProps = {
  value: string;
  setValue: (val: string) => void;
  onSave: () => void;
  onCancel: () => void;
  placeholder?: string;
  saveLabel?: string;
};

export const NoteEditForm = ({
  value,
  setValue,
  onSave,
  onCancel,
  placeholder,
  saveLabel,
}: NoteEditFormProps) => {
  return (
    <div className="space-y-2">
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={12}
        className="resize-none"
        autoFocus
      />
      <div className="flex gap-2">
        <Button onClick={onSave} className="flex-1">
          {saveLabel}
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
};
