import { Link, useLocation } from "react-router-dom";
import { List } from "../types/list";
import { SidebarMenuButton } from "./ui/sidebar";

type ListItemProps = {
  list: List;
};

export const ListItem = ({ list }: ListItemProps) => {
  const location = useLocation();

  return (
    <SidebarMenuButton
      asChild
      isActive={
        location.pathname === `/list/${list.Slug}` ||
        (location.pathname === "/" && list.Slug === "inbox")
      }
    >
      <Link to={`list/${list.Slug}`}>
        <span>{list.Name}</span>
      </Link>
    </SidebarMenuButton>
  );
};
