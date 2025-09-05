import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetListBySlug } from "../../wailsjs/go/main/App";
import { List } from "../types/list";
import { Page } from "../components/Page";
import { models } from "wailsjs/go/models";

export const ListPage = () => {
  const { slug } = useParams();
  const [list, setList] = useState<models.List>();

  useEffect(() => {
    const getLists = async () => {
      if (slug) {
        const result = await GetListBySlug(slug);
        setList(result);
      }
    };

    getLists();
  }, [slug]);

  return <div>{list && <Page title={list?.Name} id={list?.ID} />}</div>;
};
