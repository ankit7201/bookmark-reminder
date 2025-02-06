import { BatchText, BatchTextType } from "../types/BatchTextType";

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

export const getCurrentBatchText = async () => {
  const batchText: string = await chrome.action.getBadgeText({});
  return batchText;
};

export const setBatchTextForNewBookmark = async () => {
  const batchText: BatchText = {
    value: "NEW",
    type: BatchTextType.NEW_BOOKMARK,
  };

  await setBatchTextWithPreference(batchText);
};

export const setBatchTextForNotification = async () => {
  const batchText: BatchText = {
    value: "1",
    type: BatchTextType.NOTIFICATION,
  };

  await setBatchTextWithPreference(batchText);
};

// To decide if given batch text should be set or not
// Preference is given to notification count
// TODO: Find a better way to decide preference
const setBatchTextWithPreference = async (badgeText: BatchText) => {
  const currentBatchText: string = await getCurrentBatchText();
  const isNumber: boolean = Number.isFinite(Number(currentBatchText));
  let newBatchText: string = "";

  // If empty, set the badge text
  if (!currentBatchText) {
    newBatchText = badgeText.value;
  } else if (
    // If number is present and badge text type is anything other than notif, ignore
    isNumber &&
    badgeText.type !== BatchTextType.NOTIFICATION
  ) {
    return;
  } else if (isNumber && badgeText.type === BatchTextType.NOTIFICATION) {
    // if number and type is for notification, just update the count
    const currentCount = Number(currentBatchText);
    newBatchText = currentCount >= 99 ? "99+" : String(currentCount + 1);
  } else {
    newBatchText = badgeText.value;
  }

  await setBatchText(newBatchText);
};
