import { createBrowserRouter } from "react-router-dom";
import Layout from "@/layout";
import Inbox from "../pages/Inbox";
import Today from "../pages/Today";
import Upcoming from "../pages/Upcoming";
import Projects from "../pages/Projects";
import Settings from "../pages/Settings";
import { ListPage } from "../pages/List";
import Someday from "@/pages/Someday";
import Anytime from "@/pages/Anytime";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Inbox />,
      },
      {
        path: "inbox",
        element: <Inbox />,
      },
      {
        path: "today",
        element: <Today />,
      },
      {
        path: "upcoming",
        element: <Upcoming />,
      },
      {
        path: "someday",
        element: <Someday />,
      },
      {
        path: "anytime",
        element: <Anytime />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "list/:slug",
        element: <ListPage />,
      },
    ],
  },
]);

export default router;
