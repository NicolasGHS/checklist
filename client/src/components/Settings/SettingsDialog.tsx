import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { FolderSync, Palette, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppearanceSettings } from "./AppearanceSettings";
import { SyncSettings } from "./SyncSettings";

type SectionId = "appearance" | "sync";

const sections: {
  id: SectionId;
  label: string;
  icon: LucideIcon;
  content: React.ComponentType;
}[] = [
  { id: "appearance", label: "Appearance", icon: Palette, content: AppearanceSettings },
  { id: "sync", label: "Sync", icon: FolderSync, content: SyncSettings },
];

type SettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [activeId, setActiveId] = useState<SectionId>("appearance");
  const active = sections.find((s) => s.id === activeId) ?? sections[0];
  const Content = active.content;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 flex h-[min(560px,85vh)] w-[min(820px,90vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border bg-background shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          aria-describedby={undefined}
        >
          <nav className="flex w-52 shrink-0 flex-col gap-1 border-r bg-sidebar p-3">
            <DialogPrimitive.Title className="px-2 pb-2 pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Settings
            </DialogPrimitive.Title>
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveId(id)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-background_hover",
                  id === activeId && "bg-background_hover font-medium"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>

          <section className="flex-1 overflow-y-auto p-8">
            <h2 className="mb-6 text-2xl font-semibold text-foreground">{active.label}</h2>
            <Content />
          </section>

          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm p-1 text-muted-foreground opacity-70 transition-opacity hover:opacity-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
