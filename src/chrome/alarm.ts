import { Bookmark } from "../types/Bookmark";
import {
  getAllBookmarksForNotification,
  getAllBookmarksForReminder,
} from "./storage";

export const createAlarm = async (
  alaramName: string,
  whenInMilliseconds: number,
) => {
  await chrome.alarms.create(alaramName, {
    when: whenInMilliseconds,
  });
};

export const removeAlarm = async (alarmName: string) => {
  try {
    await chrome.alarms.clear(alarmName);
  } catch (err) {
    console.log("Cannot remove alarm", err);
  }
};

export const getAlarm = async (alarmName: string) => {
  return await chrome.alarms.get(alarmName);
};

// Alarms maybe removed in chrome so everytime service worker starts up, call this method to make
// sure alarms are set. If not, set them again
export const checkAlarmsForAllUpcomingBookmarks = async () => {
  const upcomingBookmarks: Bookmark[] = await getAllBookmarksForReminder();
  const notificationBookmarks: Bookmark[] =
    await getAllBookmarksForNotification();
  const currentTime = Date.now();

  for (const bookmark of upcomingBookmarks) {
    // If bookmark alarm hasn't reached fire time yet, check if alarm is still set or not
    if (bookmark.reminderDate >= currentTime) {
      const alarm = await getAlarm(`alarm-${bookmark.id}`);
      if (!alarm) {
        // If alarm doesn't exist, create alarm again
        await createAlarm(`alarm-${bookmark.id}`, bookmark.reminderDate);
      } else if (bookmark.reminderDate < currentTime) {
        // check if alarm for this fired or not
        const alreadyFired: boolean = notificationBookmarks.some(
          (item) => item.id === bookmark.id,
        );

        if (!alreadyFired) {
          // alarm with past time immediately fires
          await createAlarm(`alarm-${bookmark.id}`, bookmark.reminderDate);
        }
      }
    }
  }
};
