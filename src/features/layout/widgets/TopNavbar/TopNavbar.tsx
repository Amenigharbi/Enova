import { IconMenu2 } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Notification from "@/features/shared/elements/TopNavBarElements/Notification";
import Profile from "@/features/shared/elements/TopNavBarElements/Profile";
import StoreSelector from "../StoreSelector/StoreSelector";
import { useLayout } from "@/utils/LayoutContext";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";

export const layoutList = ["All", "Old Mghira", "Sousse", "Kamarket" , "Mnihla", "Charguia","Mghira"];
//export const layoutList = ["All", "Tunis", "Sousse", "Kamarket" , "Mnihla", "Charguia"];

const TopNav = ({
  setSidebar,
  sidebarIsOpen,
}: {
  setSidebar: Dispatch<SetStateAction<boolean>>;
  sidebarIsOpen: boolean;
}) => {
};

export default TopNav;
