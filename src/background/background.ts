import {
  checkAlarmsForAllUpcomingBookmarks,
  createAlarm,
  removeAlarm,
} from "../chrome/alarm";
import {
  setBatchTextForNewBookmark,
  setBatchTextForNotification,
} from "../chrome/badge";
import {
  removeAllBookmarksForFolder,
  removeBookmark,
} from "../chrome/bookmark";
import {
  addBookmarkForNotification,
  addBookmarkForReminder,
  getBookmarkForReminder,
  getBookmarkReminderDuration,
  getExtensionState,
  removeBookmarkForReminder,
  setExtensionState,
  setReminderDurationTimeUnit,
  updateBookmarkReminderTime,
} from "../chrome/storage";
import { DEFAULT_REMINDER_TIMER } from "../Constants";
import { Bookmark } from "../types/Bookmark";
import { ExtensionState } from "../types/ExtensionState";

chrome.runtime.onInstalled.addListener(async () => {
  await updateBookmarkReminderTime(DEFAULT_REMINDER_TIMER);
  await setExtensionState(ExtensionState.ENABLED);
  await setReminderDurationTimeUnit("days");
});

chrome.bookmarks.onCreated.addListener(async (_id, bookmark) => {
  const extensionState: ExtensionState = await getExtensionState();
  if (extensionState == ExtensionState.DISABLED) {
    return;
  }

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

  await setBatchTextForNewBookmark();
});

chrome.bookmarks.onRemoved.addListener(async (_id, removeInfo) => {
  const isFolder: boolean = !removeInfo.node.url;

  if (isFolder) {
    await removeAllBookmarksForFolder(removeInfo);
  } else {
    await removeBookmark(removeInfo.node.id);
  }
});

// ------------- Alarm -------------
chrome.alarms.onAlarm.addListener(async (alarm) => {
  const alarmId: string = alarm.name; // alarm name is same as bokmark id with "alarm-" in the beginning
  const bookmarkId: string = alarmId.replace("alarm-", "");

  const reminderBookmark: Bookmark | null =
    await getBookmarkForReminder(bookmarkId);
  if (!reminderBookmark) {
    return;
  }

  await addBookmarkForNotification(reminderBookmark);
  await removeBookmarkForReminder(reminderBookmark.id);
  await removeAlarm(alarmId); // In case fired alarm is not automatically deleted

  await setBatchTextForNotification();
});

self.addEventListener("activate", (event) => {
  // @ts-ignore
  event.waitUntil(
    (async () => {
      await checkAlarmsForAllUpcomingBookmarks();
    })(),
  );
});
