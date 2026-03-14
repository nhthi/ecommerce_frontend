import { Deal } from "./DealType";

export interface HomeData {
  id?: number;
  grid?: HomeCategory[];
  shopByCategories?: HomeCategory[];
  electricCategories?: HomeCategory[];
  deals?: Deal[];
  dealCategories?: HomeCategory[];
}

export interface HomeCategory {
  id?: number;
  categoryId?: string;
  name?: string;
  image: string;
  section?: string;
  parentCategoryId?: string;
}
