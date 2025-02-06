import { createAlarm } from "../chrome/alarm";
import { setBatchText } from "../chrome/badge";
import {
  addBookmarkForReminder,
  getBookmarkReminderDuration,
  updateBookmarkReminderTime,
} from "../chrome/storage";
import { DEFAULT_REMINDER_TIMER } from "../Constants";
import { Bookmark } from "../types/Bookmark";

chrome.runtime.onInstalled.addListener(async () => {
  await updateBookmarkReminderTime(DEFAULT_REMINDER_TIMER);
});

chrome.bookmarks.onCreated.addListener(async (_id, bookmark) => {
  if (!bookmark.url || !bookmark.id) {
    return;
  }

  const reminderDurationMilliseconds = await getBookmarkReminderDuration();
  const dateAdded = bookmark.dateAdded || Date.now();
  const reminderDate = dateAdded + reminderDurationMilliseconds;

  const addedBookmark: Bookmark = {
    id: bookmark.id,
    dateAdded: dateAdded,
    title: bookmark.title,
    url: bookmark.url || "",
    reminderDate: reminderDate,
  };

  await createAlarm(`alarm-${bookmark.id}`, reminderDate);
  await addBookmarkForReminder(addedBookmark);
  await setBatchText("NEW");
});
