const SEARCH_HISTORY_KEY = "search_history";

export const getLocalSearchHistory = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveLocalSearchHistory = (keyword: string) => {
  const trimmed = keyword.trim();
  if (!trimmed) return;

  const oldData = getLocalSearchHistory();
  const cleaned = oldData.filter(
    (item) => item.toLowerCase() !== trimmed.toLowerCase()
  );

  const newData = [trimmed, ...cleaned].slice(0, 8);
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newData));
};

export const deleteLocalSearchKeyword = (keyword: string) => {
  const oldData = getLocalSearchHistory();
  const newData = oldData.filter(
    (item) => item.toLowerCase() !== keyword.toLowerCase()
  );
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newData));
};

export const clearLocalSearchHistory = () => {
  localStorage.removeItem(SEARCH_HISTORY_KEY);
};