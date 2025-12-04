""
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

            ]
        },
        {
            title: "Settings",
            items: [
                {
                    title: "Change Password",
                    href: "/change-password",
                    icon: "Settings", // ✅ String
                    roles: ["CLIENT"],
                },
            ],
        },
    ]
}

export const hostNavItems: NavSection[] = [
  {
    title: "Event Management",
    items: [
      {
        title: "Create Event",
        href: "/host/dashboard/create-event",
        icon: "PlusCircle", // ✅ String
        roles: ["HOST"],
      },
      {
        title: "All Events",
        href: "/host/dashboard/events",
        icon: "List", // ✅ String
        roles: ["HOST"],
      },
      {
        title: "My Events",
        href: "/host/dashboard/my-events",
        icon: "Calendar", // ✅ String
        roles: ["HOST"],
      },
      {
        title: "Event Details",
        href: "/host/dashboard/events/[id]",
        icon: "FileText", // ✅ String — dynamic route template
        roles: ["HOST"],
      },
      {
        title: "Participants",
        href: "/host/dashboard/participants",
        icon: "Users", // ✅ String
        badge: "new",
        roles: ["HOST"],
      },
      {
        title: "Schedules",
        href: "/host/dashboard/schedules",
        icon: "Clock", // ✅ String
        roles: ["HOST"],
      },
    ],
  },
];


export const clientNavItems: NavSection[] = [
    {
      title: "Events",
      items: [
        {
          title: "Browse Events",
          href: "/events",
          icon: "Globe", // দেখুন: আপনার আইকন লাইব্রেরি অনুযায়ী বদলাতে পারেন
          roles: ["CLIENT"],
        },
        {
          title: "Event Details",
          href: "/events/[id]",
          icon: "FileText",
          roles: ["CLIENT"],
        },
        {
          title: "Book / Join Event",
          href: "/events/[id]/join",
          icon: "UserPlus",
          roles: ["CLIENT"],
        },
      ],
    },
    {
      title: "My Activities",
      items: [
        {
          title: "My Bookings",
          href: "/dashboard/my-bookings",
          icon: "Calendar",
          roles: ["CLIENT"],
        },
        {
          title: "My Reviews",
          href: "/dashboard/my-reviews",
          icon: "Star",
          roles: ["CLIENT"],
        },
        {
          title: "My Payments",
          href: "/dashboard/my-payments",
          icon: "CreditCard",
          roles: ["CLIENT"],
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          title: "Profile",
          href: "/dashboard/profile",
          icon: "User",
          roles: ["CLIENT"],
        },
        {
          title: "Apply to be Host",
          href: "/apply-host",
          icon: "UserCheck",
          roles: ["CLIENT"],
        },
        {
          title: "Change Password",
          href: "/dashboard/change-password",
          icon: "Lock",
          roles: ["CLIENT"],
        },
      ],
    },
  ];
  

export const adminNavItems: NavSection[] = [
    {
        title: "User Management",
        items: [
            {
                title: "Admins",
                href: "/admin/dashboard/admins-management",
                icon: "Shield", // ✅ String
                roles: ["ADMIN"],
            },
            {
                title: "Doctors",
                href: "/admin/dashboard/doctors-management",
                icon: "Stethoscope", // ✅ String
                roles: ["ADMIN"],
            },
            {
                title: "Patients",
                href: "/admin/dashboard/patients-management",
                icon: "Users", // ✅ String
                roles: ["ADMIN"],
            },
        ],
    },
    {
        title: "Hospital Management",
        items: [
            {
                title: "Appointments",
                href: "/admin/dashboard/appointments-management",
                icon: "Calendar", // ✅ String
                roles: ["ADMIN"],
            },
            {
                title: "Schedules",
                href: "/admin/dashboard/schedules-management",
                icon: "Clock", // ✅ String
                roles: ["ADMIN"],
            },
            {
                title: "Specialities",
                href: "/admin/dashboard/specialities-management",
                icon: "Hospital", // ✅ String
                roles: ["ADMIN"],
            },
        ],
    }
]

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
}