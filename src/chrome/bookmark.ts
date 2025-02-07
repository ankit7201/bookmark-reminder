import { BookmarkNode, FolderNode, RemoveInfo } from "../types/RemoveInfo";
import { removeBookmarkForReminder } from "./storage";

export const removeBookmark = async (bookmarkId: string) => {
  await chrome.alarms.clear(`alarm-${bookmarkId}`);
  await removeBookmarkForReminder(bookmarkId);
};

export const removeAllBookmarksForFolder = async (removeInfo: RemoveInfo) => {
  if (!removeInfo || !removeInfo.node || !removeInfo.node.children) {
    return;
  }

  await removeBookmarkRecursively(removeInfo.node.children);
};

const removeBookmarkRecursively = async (
  children: (BookmarkNode | FolderNode)[],
) => {
  if (!children) {
    return;
  }

  for (const child of children) {
    // if bookmark node
    if ("url" in child) {
      await removeBookmark(child.id);
    } else if ("children" in child && child.children) {
      // if folder node
      await removeBookmarkRecursively(child.children);
    }
  }
};
