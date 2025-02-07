import { useEffect, useState } from "react";
import { Bookmark } from "../types/Bookmark";
import { getAllBookmarksForNotification } from "../chrome/storage";
import Card from "./Card";
import { CardButton } from "../types/CardButton";
import { Bell, Trash2 } from "lucide-react";

const cardButtons: CardButton[] = [
  {
    title: "Reset Reminder",
    icon: <Bell size={12} />,
    onClick: () => {
      console.log("Remind Again later clicked");
    },
  },
  {
    title: "Delete",
    icon: <Trash2 size={12} />,
    onClick: () => {
      console.log("Delete button clicked");
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

  return (
    <div>
      {bookmarks.map((bookmark) => (
        <Card bookmark={bookmark} cardButtons={cardButtons} />
      ))}
    </div>
  );
};

export default Notifications;
