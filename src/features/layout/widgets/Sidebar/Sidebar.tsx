import {
  IconX,
  IconCategory,
  IconRobot,
  IconBuilding,
  IconTrees,
  IconChevronDown,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "./useSidebar";
import Divider from "@/features/shared/elements/SidebarElements/Divider";

const Sidebar = ({ setSidebar, sidebarIsOpen }: any) => {
  const { push, pathname, sidebarRef } = useSidebar(setSidebar);

  const DomainesButton = () => {
    const isActive = pathname?.toLowerCase().includes("domaine");
    
    return (
      <div className="mb-4">
        <button
          onClick={() => push("/domaines")}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
            isActive 
              ? 'bg-green-800 text-white shadow-md border-l-4 border-green-500' 
              : 'text-gray-700 hover:bg-green-50 hover:text-green-700 dark:text-gray-300 dark:hover:bg-green-900/20'
          }`}
        >
          <div className="flex items-center gap-3">
            <IconCategory className="w-5 h-5" />
            <span className="font-medium">Domaines</span>
          </div>
          <IconChevronDown className={`w-4 h-4 transition-transform ${isActive ? 'rotate-180' : ''}`} />
        </button>

        {/* Sous-menu */}
        {isActive && (
          <div className="mt-2 ml-4 space-y-1">
            {[
              { name: "Industrie 4.0", path: "/domaines/industrie-4-0", icon: <IconRobot size={16} /> },
              { name: "Indoor", path: "/domaines/indoor", icon: <IconBuilding size={16} /> },
              { name: "Outdoor", path: "/domaines/outdoor", icon: <IconTrees size={16} /> },
            ].map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  pathname === item.path
                    ? 'bg-green-100 text-green-700 border-r-2 border-green-500'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`z-[21] w-[280px] shadow-sm xxxl:w-[336px] ${
        sidebarIsOpen
          ? "visible translate-x-0"
          : "invisible ltr:-translate-x-full rtl:translate-x-full"
      } sidebar fixed top-0 h-full bg-n0 duration-300 dark:bg-bg4 ltr:left-0 rtl:right-0`}
      ref={sidebarRef}
    >
      <div className={`p-5`}>
        <div className="flex items-center justify-center">
          <Link href="/">
            <Image 
              alt="logo" 
              width={180} 
              height={38} 
              src="/images/enova.png"
              className="object-contain"
              priority 
            />
          </Link>
          <button onClick={() => setSidebar(false)} className="xxl:hidden">
            <IconX />
          </button>
        </div>
      </div>
      <div className="fixed left-0 right-0 h-full overflow-y-auto pb-12">
        <div className="min-h-[70%] px-4 pb-24 xxl:px-6 xxxl:px-8">
          <DomainesButton />
          <Divider />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;