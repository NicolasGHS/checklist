import { ModeToggle } from "../mode-toggle";

export const AppearanceSettings = () => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-foreground">Theme</span>
      <ModeToggle />
    </div>
  );
};
