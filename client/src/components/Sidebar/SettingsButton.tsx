import { Settings2 } from "lucide-react";
import { Link } from "react-router-dom";

export const SettingsButton = () => {
  return (
    <Link to="/settings" className="hover:bg-background_hover p-1 rounded">
      <Settings2 className="w-5" />
    </Link>
  );
};
