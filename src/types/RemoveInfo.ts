export interface BookmarkNode {
  id: string;
  index?: number;
  parentId?: string;
  dateAdded?: number;
  title: string;
  url?: string;
}

export interface FolderNode {
  id: string;
  parentId?: string;
  dateAdded?: number;
  title: string;
  children?: (BookmarkNode | FolderNode)[];
  dateGroupModified: number;
}

export interface RemoveInfo {
  index: number;
  parentId: string;
  node: {
    id: string;
    dateAdded?: number;
    title: string;
    children?: (BookmarkNode | FolderNode)[];
    dateGroupModified?: number;
  };
}
