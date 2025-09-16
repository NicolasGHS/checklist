import ListItem from "@/components/ListItem";
import { useEffect, useState } from "react";
import { GetLists } from "../../wailsjs/go/main/App";
import { models } from "../../wailsjs/go/models";

export default function Anytime() {
  const [lists, setLists] = useState<models.List[]>([]);

  const loadLists = async () => {
    try {
      const result = await GetLists();
      setLists(result);
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
      {lists.map((list, index) => (
        <ListItem list={list} />
      ))}
    </div>
  );
}
