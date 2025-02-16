export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
  createdAt: Date;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}