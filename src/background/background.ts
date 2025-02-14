import {
  checkAlarmsForAllUpcomingBookmarks,
  createAlarm,
} from "../chrome/alarm";
import { setBatchTextForNewBookmark } from "../chrome/badge";
import {
  removeAllBookmarksForFolder,
  removeBookmark,
} from "../chrome/bookmark";
import {
  addBookmarkForReminder,
  getBookmarkReminderDuration,
  getExtensionState,
  setExtensionState,
  setReminderDurationTimeUnit,
  updateBookmarkReminderTime,
} from "../chrome/storage";
import { DEFAULT_REMINDER_TIMER } from "../Constants";
import { Bookmark } from "../types/Bookmark";
import { ExtensionState } from "../types/ExtensionState";
import { AlarmQueue } from "../utils/AlarmQueue";

let initComplete = (async () => {
  await checkAlarmsForAllUpcomingBookmarks();
})();

chrome.runtime.onInstalled.addListener(async () => {
  await updateBookmarkReminderTime(DEFAULT_REMINDER_TIMER);
  await setExtensionState(ExtensionState.ENABLED);
  await setReminderDurationTimeUnit("days");
});

chrome.bookmarks.onCreated.addListener(async (_id, bookmark) => {
  await initComplete;

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
  await initComplete;

  const isFolder: boolean = !removeInfo.node.url;

  if (isFolder) {
    await removeAllBookmarksForFolder(removeInfo);
  } else {
    await removeBookmark(removeInfo.node.id);
  }
});

const alarmQueue = new AlarmQueue();

// ------------- Alarm -------------
chrome.alarms.onAlarm.addListener(async (alarm) => {
  await initComplete;

  // const alarmId: string = alarm.name; // alarm name is same as bokmark id with "alarm-" in the beginning
  // const bookmarkId: string = alarmId.replace("alarm-", "");

  // const reminderBookmark: Bookmark | null =
  //   await getBookmarkForReminder(bookmarkId);
  // if (!reminderBookmark) {
  //   return;
  // }

  // await addBookmarkForNotification(reminderBookmark);
  // await removeBookmarkForReminder(reminderBookmark.id);
  // await removeAlarm(alarmId); // In case fired alarm is not automatically deleted

  // await setBatchTextForNotification();
  alarmQueue.enqueue(alarm);
});
