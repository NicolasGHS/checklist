import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Inbox from "../pages/Inbox";
import Today from "../pages/Today";
import Upcoming from "../pages/Upcoming";
import Projects from "../pages/Projects";

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
    ],
  },
]);

export default router;
