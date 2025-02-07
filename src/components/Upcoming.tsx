import { useEffect, useState } from "react";
import { Bookmark } from "../types/Bookmark";
import { getAllBookmarksForReminder } from "../chrome/storage";
import Card from "./Card";
import { CardButton } from "../types/CardButton";
import { Trash2 } from "lucide-react";

const cardButtons: CardButton[] = [
  {
    title: "Delete Reminder",
    icon: <Trash2 size={12} />,
    onClick: () => {
      console.log("Delete Reminder button clicked");
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

  return (
    <div>
      {bookmarks.map((bookmark) => (
        <Card bookmark={bookmark} cardButtons={cardButtons} />
      ))}
    </div>
  );
};

export default Upcoming;
