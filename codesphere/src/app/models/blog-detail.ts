import {User} from "./user";
import {ReactionCount} from "./reaction-count";

export interface BlogDetail {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  excerpt: string;
  featuredImage: string;
  status: string;
  viewCount: number;
  publishedAt: string;
  author: User;
  tags: string[];
  commentCount: number;
  reactionCounts: ReactionCount;
  image: string;
  featured: boolean;
}
