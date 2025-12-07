("");
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
      // {
      //   title: "All Events",
      //   href: "/host/dashboard/all-events",
      //   icon: "List", // ✅ String
      //   roles: ["HOST"],
      // },
      {
        title: "My Events",
        href: "/host/dashboard/my-events",
        icon: "Calendar", // ✅ String
        roles: ["HOST"],
      },

      {
        title: "Participants",
        href: "/host/dashboard/participants",
        icon: "Users", // ✅ String
        badge: "new",
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
        title: "Join Events",
        href: "/dashboard/join-events",
        icon: "Calendar",
        roles: ["CLIENT"],
      },
      {
        title: "My Bookings",
        href: "/dashboard/my-bookings",
        icon: "Calendar",
        roles: ["CLIENT"],
      },
      // {
      //   title: "My Reviews",
      //   href: "/dashboard/my-reviews",
      //   icon: "Star",
      //   roles: ["CLIENT"],
      // },
      // {
      //   title: "My Payments",
      //   href: "/dashboard/my-payments",
      //   icon: "CreditCard",
      //   roles: ["CLIENT"],
      // },
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
