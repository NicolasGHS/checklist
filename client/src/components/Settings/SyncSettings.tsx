import { useEffect, useState } from "react";
import { GetSyncFolder, SelectSyncFolder, SetSyncFolder } from "../../../wailsjs/go/main/App";
import { Button } from "@/components/ui/button";

export const SyncSettings = () => {
  const [syncFolder, setSyncFolder] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    GetSyncFolder().then(setSyncFolder);
  }, []);

  const handlePickFolder = async () => {
    const folder = await SelectSyncFolder();
    if (folder) {
      setSyncFolder(folder);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await SetSyncFolder(syncFolder);
      setStatus("Sync folder updated. Your data is now stored in the selected location.");
    } catch (e) {
      setStatus(`Error: ${e}`);
    } finally {
      setSaving(false);
    }
  };

  const handleClearFolder = async () => {
    setSyncFolder("");
  };

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-4">
        Move your database to a Dropbox, iCloud Drive, or any other folder to sync across devices.
        Avoid having the app open on two devices simultaneously to prevent data corruption.
      </p>

      <div className="flex gap-2 mb-3">
        <div
          className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground truncate cursor-default"
          title={syncFolder || "Default location"}
        >
          {syncFolder || <span className="text-muted-foreground">Default location</span>}
        </div>
        <Button variant="outline" size="sm" onClick={handlePickFolder}>
          Browse…
        </Button>
        {syncFolder && (
          <Button variant="ghost" size="sm" onClick={handleClearFolder} title="Reset to default">
            ✕
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving ? "Saving…" : "Save"}
        </Button>
        {status && <p className="text-xs text-muted-foreground">{status}</p>}
      </div>
    </div>
  );
};
