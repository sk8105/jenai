import {
  LucideIcon,
  FileUp,
  Search,
  LayoutDashboard
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutDashboard,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/search",
          label: "Search",
          active: pathname.includes("/search"),
          icon: Search,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/file-upload",
          label: "Files",
          active: pathname.includes("/file-upload"),
          icon: FileUp,
          submenus: []
        }
      ]
    },
  ];
}
