import postsData from "./posts.json";

export type Block =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "h4"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "blockquote"; text: string }
  | { kind: "img"; src: string };

export interface Post {
  slug: string;
  title: string;
  publishedAt: string | null;
  excerpt: string;
  coverImage: string | null;
  blocks: Block[];
}

export const posts = postsData as unknown as Post[];

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
