import { Book } from "lucide-react";
import { Button } from "../ui/button";
import { SheetTrigger } from "../ui/sheet";

export const NotebarButton = () => {
  return (
    <SheetTrigger asChild>
      <Button variant="outline" size="icon">
        <Book className="h-4 w-4" />
      </Button>
    </SheetTrigger>
  );
};
