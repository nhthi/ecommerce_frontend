export interface ProductSuggestion {
  id: number;
  title: string;
  image?: string;
  price?: number;
  slug?: string;
}

export interface CategorySuggestion {
  id: number;
  name: string;
}

export interface SearchSuggestionResponse {
  recentKeywords: string[];
  popularKeywords: string[];
  products: ProductSuggestion[];
  categories: CategorySuggestion[];
}

export interface SearchState {
  loading: boolean;
  error: string | null;
  suggestions: SearchSuggestionResponse;
  recentSearches: string[];
}