import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { SearchState, SearchSuggestionResponse } from "../../types/SearchType";

const initialState: SearchState = {
  loading: false,
  error: null,
  suggestions: {
    recentKeywords: [],
    popularKeywords: [],
    products: [],
    categories: [],
  },
  recentSearches: [],
};

export const fetchSearchSuggestions = createAsyncThunk<
  SearchSuggestionResponse,
  string,
  { rejectValue: string }
>("search/fetchSuggestions", async (query, { rejectWithValue }) => {
  try {
    const response = await api.get(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể lấy gợi ý tìm kiếm"
    );
  }
});

export const fetchRecentSearches = createAsyncThunk<
  string[],
  void,
  { rejectValue: string }
>("search/fetchRecentSearches", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/api/search/history`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể lấy lịch sử tìm kiếm"
    );
  }
});

export const saveSearchHistory = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("search/saveSearchHistory", async (keyword, { rejectWithValue }) => {
  try {
    await api.post(`/api/search/history`, { keyword });
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể lưu lịch sử tìm kiếm"
    );
  }
});

export const deleteSearchKeyword = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("search/deleteSearchKeyword", async (keyword, { rejectWithValue }) => {
  try {
    await api.delete(`/api/search/history?keyword=${encodeURIComponent(keyword)}`);
    return keyword;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể xóa lịch sử tìm kiếm"
    );
  }
});

export const clearSearchHistory = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("search/clearSearchHistory", async (_, { rejectWithValue }) => {
  try {
    await api.delete(`/api/search/history/all`);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể xóa toàn bộ lịch sử tìm kiếm"
    );
  }
});

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setGuestRecentSearches: (state, action: PayloadAction<string[]>) => {
      state.recentSearches = action.payload;
    },
    clearSuggestionsState: (state) => {
      state.suggestions = {
        recentKeywords: [],
        popularKeywords: [],
        products: [],
        categories: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchSearchSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi khi lấy gợi ý tìm kiếm";
      })

      .addCase(fetchRecentSearches.fulfilled, (state, action) => {
        state.recentSearches = action.payload;
      })

      .addCase(deleteSearchKeyword.fulfilled, (state, action) => {
        state.recentSearches = state.recentSearches.filter(
          (item) => item !== action.payload
        );
        state.suggestions.recentKeywords = state.suggestions.recentKeywords.filter(
          (item) => item !== action.payload
        );
      })

      .addCase(clearSearchHistory.fulfilled, (state) => {
        state.recentSearches = [];
        state.suggestions.recentKeywords = [];
      });
  },
});

export const { setGuestRecentSearches, clearSuggestionsState } = searchSlice.actions;
export default searchSlice.reducer;