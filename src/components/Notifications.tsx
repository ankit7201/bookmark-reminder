import { useEffect, useState } from "react";
import { Bookmark } from "../types/Bookmark";
import { getAllBookmarksForNotification } from "../chrome/storage";
import Card from "./Card";

const Notifications = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    async function getAllNotificationBookmarks() {
      const notificationBookmarks: Bookmark[] =
        await getAllBookmarksForNotification();

      setBookmarks(notificationBookmarks);
      setIsLoading(false);
    }

    getAllNotificationBookmarks();
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

export default Notifications;
