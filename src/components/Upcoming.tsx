import { useEffect, useState } from "react";
import { Bookmark } from "../types/Bookmark";
import { getAllBookmarksForReminder } from "../chrome/storage";
import Card from "./Card";

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
        <Card bookmark={bookmark} />
      ))}
    </div>
  );
};

export default Upcoming;
