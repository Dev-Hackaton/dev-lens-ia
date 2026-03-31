const history = [];
const MAX_HISTORY = 20;

export const saveToHistory = (entry) => {
  history.unshift(entry);

  if (history.length > MAX_HISTORY) {
    history.pop();
  }
};

export const getHistory = () => {
  return history;
};

export const clearHistory = () => {
  history.length = 0;
};