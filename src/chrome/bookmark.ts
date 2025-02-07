import { removeBookmarkForReminder } from "./storage";

export const removeBookmark = async (bookmarkId: string) => {
  await chrome.alarms.clear(`alarm-${bookmarkId}`);
  await removeBookmarkForReminder(bookmarkId);
};

// @ts-ignore
export const removeAllBookmarksForFolder = async (folderId: string) => {};
