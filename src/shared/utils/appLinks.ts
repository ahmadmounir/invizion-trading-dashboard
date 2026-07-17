import {  Home, Settings, User } from "lucide-react";

export const sidebarNavigationItems = [
  {
    name: "Home",
    nameKey: "common:home",
    href: "/",
    icon: Home,
    exact: true,
  },
  {
    name: "Settings",
    nameKey: "common:settings",
    href: "/settings", 
    icon: Settings,
    exact: false,
  }
]

// Structure for settings navigation
export const settingsConfig = {
  title: 'Settings',
  sections: [
    {
      title: 'My Account',
      items: [
        {
          name: 'Profile',
          nameKey: 'common:profile',
          href: '/settings',
          icon: User,
          exact: true,
        },
        // Sessions tab is hidden for now — we might need it again in the future.
        // {
        //   name: 'sessions',
        //   nameKey: 'common:sessions',
        //   href: '/settings/sessions',
        //   icon: Lock,
        //   exact: false,
        // },
        // {
        //   name: 'Notifications',
        //   nameKey: 'common:notifications',
        //   href: '/settings/notifications',
        //   icon: Bell,
        //   exact: false,
        // }
      ]
    }
  ]
};