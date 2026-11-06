import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetListBySlug } from "bindings/checklist/app";
import { Page } from "../components/Page";
import * as models from "bindings/checklist/core/models";

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
