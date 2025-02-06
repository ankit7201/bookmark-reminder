import { useEffect, useState } from "react";
import { Bookmark } from "../types/Bookmark";
import { getAllBookmarksForReminder } from "../chrome/storage";
import Card from "./Card";

const Upcoming = () => {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    async function getAllUpcomingBookmarks() {
      const bookmarks: Bookmark[] = await getAllBookmarksForReminder();
      setBookmarks(bookmarks);
      setIsLoading(false);
    }

    getAllUpcomingBookmarks();
  }, []);

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
