import { useEffect, useState } from "react";
import { Bookmark } from "../types/Bookmark";
import {
  getAllBookmarksForReminder,
  removeBookmarkForReminder,
} from "../chrome/storage";
import Card from "./Card";
import { CardButton } from "../types/CardButton";
import { Trash2 } from "lucide-react";
import { removeAlarm } from "../chrome/alarm";

const cardButtons: CardButton[] = [
  {
    title: "Delete Reminder",
    icon: <Trash2 size={12} />,
    onClick: async (bookmarkId: string) => {
      await removeBookmarkForReminder(bookmarkId);
      await removeAlarm(`alarm-${bookmarkId}`);
    },
  },
];

const Upcoming = () => {
  const [localStorageChanged, setLocalStorageChanged] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const handleStorageChange = () => {
      setLocalStorageChanged(!localStorageChanged);
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  });

  useEffect(() => {
    async function getAllUpcomingBookmarks() {
      const bookmarks: Bookmark[] = await getAllBookmarksForReminder();
      setBookmarks(bookmarks);
      setIsLoading(false);
    }

    getAllUpcomingBookmarks();
  }, [localStorageChanged]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (bookmarks.length === 0) {
    return (
      <div className="font-semibold text-center">
        Bookmarks with upcoming reminders will be show here
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

export default Upcoming;
