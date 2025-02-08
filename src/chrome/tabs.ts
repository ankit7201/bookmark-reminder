export const openUrlInNewTab = (url: string) => {
  chrome.tabs.create({
    active: true,
    url: url,
  });
};
