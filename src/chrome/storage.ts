import { Bookmark } from "../types/Bookmark";

const BOOKMARK_STORAGE_KEY: string = "bookmarks";
const BOOKMARK_REMINDER_DURATION_KEY: string = "bookmarkReminderDuration";
const BOOKMARK_NOTIFICATION_STORAGE_KEY: string = "bookmarskNotification";

export const updateBookmarkReminderTime = async (
  durationInMillisecond: number,
) => {
  // overwrites old value
  await chrome.storage.local.set({
    [BOOKMARK_REMINDER_DURATION_KEY]: durationInMillisecond,
  });
};

export const getBookmarkReminderDuration = async () => {
  const result = await chrome.storage.local.get([
    BOOKMARK_REMINDER_DURATION_KEY,
  ]);
  const reminderInMilliseconds: number = result[BOOKMARK_REMINDER_DURATION_KEY];

  return reminderInMilliseconds;
};

// "Bookmarks for reminder" means bookmarks that have been registered but the alarm hasn't gone off yet
// or in other words upcoming bookmarks reminders
export const addBookmarkForReminder = async (bookmark: Bookmark) => {
  const result = await chrome.storage.local.get([BOOKMARK_STORAGE_KEY]);
  const bookmarks: Bookmark[] = result[BOOKMARK_STORAGE_KEY] || [];
  bookmarks.push(bookmark);

  await chrome.storage.local.set({ [BOOKMARK_STORAGE_KEY]: bookmarks });
};

export const getAllBookmarksForReminder = async () => {
  const result = await chrome.storage.local.get([BOOKMARK_STORAGE_KEY]);
  const bookmarks: Bookmark[] = result[BOOKMARK_STORAGE_KEY];

  return bookmarks;
};

export const removeBookmarkForReminder = async (bookmarkId: string) => {
  const result = await chrome.storage.local.get([BOOKMARK_STORAGE_KEY]);
  let bookmarks: Bookmark[] = result[BOOKMARK_STORAGE_KEY] || [];

  bookmarks = bookmarks.filter((bookmark) => bookmark.id !== bookmarkId);
  await chrome.storage.local.set({
    [BOOKMARK_STORAGE_KEY]: bookmarks,
  });
};

// "Bookmarks for notification" means bookmarks whose alarm has gone off
export const addBookmarkForNotification = async (bookmark: Bookmark) => {
  const result = await chrome.storage.local.get([
    BOOKMARK_NOTIFICATION_STORAGE_KEY,
  ]);

  const bookmarkskNotifications: Bookmark[] =
    result[BOOKMARK_NOTIFICATION_STORAGE_KEY] || [];

  bookmarkskNotifications.push(bookmark);

  await chrome.storage.local.set({
    [BOOKMARK_NOTIFICATION_STORAGE_KEY]: bookmarkskNotifications,
  });
};

export const getAllBookmarksForNotification = async () => {
  const result = await chrome.storage.local.get([
    BOOKMARK_NOTIFICATION_STORAGE_KEY,
  ]);
  const bookmarks: Bookmark[] = result[BOOKMARK_NOTIFICATION_STORAGE_KEY];

  return bookmarks;
};

export const removeBookmarkForNotification = async (bookmarkId: string) => {
  const result = await chrome.storage.local.get([
    BOOKMARK_NOTIFICATION_STORAGE_KEY,
  ]);
  let bookmarks: Bookmark[] = result[BOOKMARK_NOTIFICATION_STORAGE_KEY];

  bookmarks = bookmarks.filter((bookmark) => bookmark.id !== bookmarkId);
  await chrome.storage.local.set({
    [BOOKMARK_NOTIFICATION_STORAGE_KEY]: bookmarks,
  });
};
