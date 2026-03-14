export interface Category {
  id?: number;
  name?: string | null;
  categoryId: string;
  level: number;
  parentCategory: Category | null;
}

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}
