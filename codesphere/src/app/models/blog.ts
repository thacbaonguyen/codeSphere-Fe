export interface Blog {
  id: number;
  title: string;
  excerpt: string;
  featuredImage: string | null;
  author: string;
  tagNames: string[];
  status: string;
  viewCount: number;
  publishedAt: string;
  commentCount: number;
  totalReactions: number;
  slug: string;
  image: string | null;
  featured: boolean;
}
