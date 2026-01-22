
import { NavSection } from "@/types/dashboard.interface";
import { getDefaultDashboardRoute, UserRole } from "./auth-utils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);

  return [
    {
      items: [
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "LayoutDashboard",
          roles: ["ADMIN", "HOST", "CLIENT"],
        },
        {
          title: "My Profile",
          href: `/my-profile`,
          icon: "User",
          roles: ["ADMIN", "HOST", "CLIENT"],
        },
    
      ],
    },
  ];
};

export const hostNavItems: NavSection[] = [
  {
    title: "Event Management",
    items: [
    
      {
        title: "My Events",
        href: "/host/dashboard/my-events",
        icon: "Calendar", 
        roles: ["HOST"],
      },

   
    ],
  },
];

export const clientNavItems: NavSection[] = [
  {
    title: "My Activities",
    items: [
  
      {
        title: "My Bookings",
        href: "/dashboard/my-bookings",
        icon: "Calendar",
        roles: ["CLIENT"],
      },
  
    ],
  },

];

export const adminNavItems: NavSection[] = [
  {
    title: "User & Role Management",
    items: [
 
      {
        title: "Hosts Management",
        href: "/admin/dashboard/hosts-management",
        icon: "UserCheck",
        roles: ["ADMIN"],
      },
      {
        title: "Clients Management",
        href: "/admin/dashboard/clients-management",
        icon: "Users",
        roles: ["ADMIN"],
      },
      {
        title: "Host Applications",
        href: "/admin/dashboard/host-applications",
        icon: "FileText",
        roles: ["ADMIN"],
        badge: "pending",
      },
    ],
  },

  {
    title: "Events Management",
    items: [
   

      {
        title: "Events Management",
        href: "/admin/dashboard/events-management",
        icon: "CheckCircle",
        roles: ["ADMIN"],
      },

      {
        title: "Payment History",
        href: "/admin/dashboard/payment-history",
        icon: "Star",
        roles: ["ADMIN"],
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "ADMIN":
      return [...commonNavItems, ...adminNavItems];
    case "HOST":
      return [...commonNavItems, ...hostNavItems];
    case "CLIENT":
      return [...commonNavItems, ...clientNavItems];
    default:
      return [];
  }
};
