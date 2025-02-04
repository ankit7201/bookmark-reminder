export const setBatchText = async (badgeText: string) => {
  chrome.action.setBadgeText({
    text: badgeText,
  });
};

export const clearBatchText = async () => {
  chrome.action.setBadgeText({
    text: "",
  });
};
