import { removeAlarm } from "../chrome/alarm";
import { setBatchTextForNotification } from "../chrome/badge";
import {
  addBookmarkForNotification,
  getBookmarkForReminder,
  removeBookmarkForReminder,
} from "../chrome/storage";
import { Bookmark } from "../types/Bookmark";

export class AlarmQueue {
  private queue: Array<chrome.alarms.Alarm> = [];
  private isProcessing: boolean = false;

  async enqueue(alarm: chrome.alarms.Alarm) {
    this.queue.push(alarm);
    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const alarm = this.queue.shift();
    if (!alarm) {
      return;
    }

    try {
      await this.processAlarm(alarm);
    } catch (err) {
      console.log("Error processing alarm: ", err);
    }

    await this.processQueue();
  }

  private async processAlarm(alarm: chrome.alarms.Alarm) {
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
  }
}
