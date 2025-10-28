import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { PanelRight } from "lucide-react";

export const Notebar: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <PanelRight className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Side Panel</SheetTitle>
          <SheetDescription>
            This is a side sheet that slides in from the right.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <p>Add your content here...</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
