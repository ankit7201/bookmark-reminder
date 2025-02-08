export interface Bookmark {
  id: string;
  dateAdded: number; // epoch time
  title: string;
  url: string;
  reminderDate: number; // epoch time
}
