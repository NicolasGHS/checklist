import { useState } from "react";
import { Settings2 } from "lucide-react";
import { SettingsDialog } from "../Settings/SettingsDialog";

export const SettingsButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hover:bg-background_hover p-1 rounded"
      >
        <Settings2 className="w-5" />
      </button>
      <SettingsDialog open={open} onOpenChange={setOpen} />
    </>
  );
};
