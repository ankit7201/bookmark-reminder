import { Bookmark as BookmarkIcon, Clock } from "lucide-react";
import { Bookmark } from "../types/Bookmark";
import { CardButton } from "../types/CardButton";
import { getHumanDateFromEpoch } from "../utils/date";
import { openUrlInNewTab } from "../chrome/tabs";

const Card = ({
  bookmark,
  cardButtons,
}: {
  bookmark: Bookmark;
  cardButtons: CardButton[];
}) => {
  return (
    <div
      onClick={() => {
        openUrlInNewTab(bookmark.url);
      }}
      key={bookmark.id}
      className="mb-2 group border border-gray-100 p-3 mx-2 transition-all duration-150 east-in-out hover:border-l-2 hover:border-l-indigo-500 hover:bg-indigo-50/30 hover:translate-x-0.5"
    >
      <div className="flex justify-between">
        <div className="flex-1 space-y-1 w-[70%]">
          <h2 className="font-semibold text-xl text-gray-900 leading-snug truncate">
            {bookmark.title}
          </h2>
          <a
            href="#"
            className="block text-blue-600 overflow-hidden overflow-ellipsis whitespace-nowrap text-xs"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            {bookmark.url}
          </a>
          <div className="flex items-center text-gray-400 text-xs">
            <BookmarkIcon size={12} className="text-emerald-600" />
            <span className="text-sm text-gray-600">
              Saved on {getHumanDateFromEpoch(bookmark.dateAdded)}
            </span>
          </div>
          <div className="flex items-center text-gray-400 text-xs">
            <Clock size={12} className="text-blue-600" />
            <span className="text-sm text-gray-600">
              Reminder on {getHumanDateFromEpoch(bookmark.reminderDate)}
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-1.5 opacity-0 w-[30%] group-hover:opacity-100">
          {cardButtons &&
            cardButtons.map((button) => (
              <button
                onClick={() => {
                  button.onClick(bookmark.id);
                }}
                className="flex items-center px-2 py-1 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors rounded"
              >
                {button.icon}
                {button.title}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
