import { createBrowserRouter } from "react-router-dom";
import Layout from "@/layout";
import Inbox from "../pages/Inbox";
import Today from "../pages/Today";
import Upcoming from "../pages/Upcoming";
import Projects from "../pages/Projects";
import Settings from "../pages/Settings";

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
        path: "projects",
        element: <Projects />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

export default router;
