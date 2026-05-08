// Centralized site config / nav so every page imports the same thing.

export const SITE = {
  name: "Fleet Fueling Card",
  url: "https://fleetfuelingcard.com",
  email: "morrison@fleetfuelingcard.com",
  tagline: "Fuel Card Solutions for Business Fleet Management",
} as const;

export const NAV: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us/" },
  { label: "Fleet Fueling Solutions", href: "/fleet-fueling-solutions/" },
  { label: "Fleet Cards", href: "/fleet-cards/" },
  { label: "Fueling Blog", href: "/fueling-blog/" },
  { label: "Contact", href: "/contact/" },
];

export const FOOTER_MENU: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Fleet Fueling Solutions", href: "/fleet-fueling-solutions/" },
  { label: "Fueling Blog", href: "/fueling-blog/" },
  { label: "Contact", href: "/contact/" },
];

export const FOOTER_LEGAL: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Terms of Use", href: "/terms-of-use/" },
  { label: "Privacy Policy", href: "/privacy-policy/" },
];
