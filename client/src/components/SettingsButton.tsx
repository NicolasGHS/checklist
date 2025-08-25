import { Settings2 } from "lucide-react";
import { Link } from "react-router-dom";

export const SettingsButton = () => {
  return (
    <Link to="/settings">
      <Settings2 />
    </Link>
  );
};
