export interface Bookmark {
  id: string;
  dateAdded: number;
  title: string;
  url: string;
  reminderDate: number; // epoch time
}
