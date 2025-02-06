export interface BatchText {
  type: BatchTextType;
  value: string;
}

export enum BatchTextType {
  NOTIFICATION,
  NEW_BOOKMARK,
}
