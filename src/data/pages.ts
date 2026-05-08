// Type wrapper around pages.json so consumers get autocomplete + safe access.
import pagesData from "./pages.json";

export interface Section {
  heading: string | null;
  body: string;
  image: string | null;
  imageAlt: string;
  cta: { label: string; href: string } | null;
}

export interface Page {
  slug: string;
  title: string;
  metaDescription: string | null;
  h1: string;
  subtitle: string | null;
  heroImage: string;
  sections: Section[];
  contactInfo?: { email?: string } | null;
}

export const pages = pagesData as unknown as Page[];

export function getPage(slug: string): Page {
  const p = pages.find((x) => x.slug === slug);
  if (!p) throw new Error(`Page not found: ${slug}`);
  return p;
}
