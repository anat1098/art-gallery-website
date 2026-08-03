export type NavItem = {
  label: string;
  labelHe: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: "Prints", labelHe: "הדפסים", href: "/prints" },
  { label: "Originals", labelHe: "יצירות מקור", href: "/originals" },
  { label: "About", labelHe: "אודות", href: "/about" },
  { label: "Contact", labelHe: "צור קשר", href: "/contact" },
];
