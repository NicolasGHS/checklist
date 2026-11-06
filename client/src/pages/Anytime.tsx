import ListItem from "@/components/ListItem";
import { useEffect, useState } from "react";
import { GetLists } from "bindings/checklist/app";
import * as models from "bindings/checklist/core/models";

export default function Anytime() {
  const [lists, setLists] = useState<models.List[]>([]);

  const loadLists = async () => {
    try {
      const result = await GetLists();
      setLists(result ?? []);
    } catch (error) {
      console.error("Failed to fetch lists", error);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  return (
    <div className="mt-10 flex flex-col min-h-full ">
      <h1 className="text-3xl text-foreground font-bold mb-6">Anytime</h1>
      {lists.map((list) => (
        <ListItem list={list} key={list.ID} />
      ))}
    </div>
  );
}
