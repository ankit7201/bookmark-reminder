import { ReactNode } from "react";

export interface CardButton {
  title: string;
  icon: ReactNode;
  onClick: (bookmarkId: string) => void;
}
