export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

export interface BlogUser {
  id: number;
  fullName?: string;
  email?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  content: string;
  thumbnailUrl?: string;
  status: BlogStatus;
  publishedAt?: string | null;
  viewCount?: number;
  category?: BlogCategory | null;
  createdBy?: BlogUser | null;
  tags?: BlogTag[];
}

/* ===== FORM VALUES ===== */

export interface BlogCategoryFormValues {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface BlogTagFormValues {
  name: string;
  slug: string;
}

export interface BlogPostFormValues {
  title: string;
  slug: string;
  shortDescription?: string;
  content: string;
  thumbnailUrl?: string;
  status: BlogStatus;
  publishedAt?: string | null;
  viewCount?: number;
  category?: {
    id: number;
  } | null;
  createdBy?: {
    id: number;
  } | null;
  tags?: { id: number }[];
}

/* ===== STATE ===== */

export interface BlogCategoryState {
  categories: BlogCategory[];
  loading: boolean;
  error: string | null;
}

export interface BlogTagState {
  tags: BlogTag[];
  loading: boolean;
  error: string | null;
}

export interface BlogPostState {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
}