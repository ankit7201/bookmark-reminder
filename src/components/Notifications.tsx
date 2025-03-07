import { useEffect, useState } from "react";
import { Bookmark } from "../types/Bookmark";
import {
  addBookmarkForReminder,
  getAllBookmarksForNotification,
  getBookmarkForNotification,
  getBookmarkReminderDuration,
  removeBookmarkForNotification,
} from "../chrome/storage";
import Card from "./Card";
import { CardButton } from "../types/CardButton";
import { Bell, Trash2 } from "lucide-react";
import { createAlarm, removeAlarm } from "../chrome/alarm";

const cardButtons: CardButton[] = [
  {
    title: "Reset Reminder",
    icon: <Bell size={12} />,
    onClick: async (bookmarkId: string) => {
      const bookmark: Bookmark | null =
        await getBookmarkForNotification(bookmarkId);
      if (!bookmark) {
        return;
      }

      const reminderDuration: number = await getBookmarkReminderDuration();
      const currentTimeInMs: number = Date.now();

      const reminderTime: number = currentTimeInMs + reminderDuration;

      bookmark.reminderDate = reminderTime;

      await removeBookmarkForNotification(bookmark.id);
      await addBookmarkForReminder(bookmark);
      await removeAlarm(`alarm-${bookmark.id}`); // remove old alarm in case it is not cleared
      await createAlarm(`alarm-${bookmark.id}`, reminderTime);
    },
  },
  {
    title: "Delete",
    icon: <Trash2 size={12} />,
    onClick: async (bookmarkId: string) => {
      await removeBookmarkForNotification(bookmarkId);
      await removeAlarm(`alarm-${bookmarkId}`); // Clear alarm in case it is not cleared
    },
  },
];

const Notifications = () => {
  const [localStorageChanged, setLocalStorageChanged] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // TODO: Extract this out to a custom hook
  useEffect(() => {
    const handleStorageChange = () => {
      setLocalStorageChanged(!localStorageChanged);
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  });

  useEffect(() => {
    async function getAllNotificationBookmarks() {
      const notificationBookmarks: Bookmark[] =
        await getAllBookmarksForNotification();

      setBookmarks(notificationBookmarks);
      setIsLoading(false);
    }

    getAllNotificationBookmarks();
  }, [localStorageChanged]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center font-semibold">
        Bookmark reminders will be shown here
      </div>
    );
  }

  return (
    <div>
      {bookmarks.map((bookmark) => (
        <Card bookmark={bookmark} cardButtons={cardButtons} />
      ))}
    </div>
  );
};

export default Notifications;
