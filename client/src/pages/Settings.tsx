import { useEffect, useState } from "react";
import { ModeToggle } from "../components/mode-toggle";
import { GetSyncFolder, SelectSyncFolder, SetSyncFolder } from "../../wailsjs/go/main/App";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
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
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Settings</h1>

      <section className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Theme</span>
          <ModeToggle />
        </div>
      </section>

      <Separator className="mb-8" />

      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
          Sync
        </h2>
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
          {status && (
            <p className="text-xs text-muted-foreground">{status}</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Settings;
