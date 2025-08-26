import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetListBySlug } from "../../wailsjs/go/main/App";
import { List } from "../types/list";

export const ListPage = () => {
  const { slug } = useParams();
  const [list, setList] = useState<List>();

  useEffect(() => {
    const getLists = async () => {
      if (slug) {
        const result = await GetListBySlug(slug);
        setList(result);
      }
    };

    getLists();
  }, [slug]);

  console.log("list: ", list);

  return (
    <div className="p-6">
      <h1 className="text-3xl text-foreground font-bold mb-6">{list?.Name}</h1>
    </div>
  );
};
