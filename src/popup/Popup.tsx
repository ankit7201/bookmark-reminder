import { useEffect } from "react";
import { clearBatchText } from "../chrome/badge";
import Tabs from "../components/Tabs";
import Notifications from "../components/Notifications";
import Upcoming from "../components/Upcoming";
import Settings from "../components/Settings";

const tabs = [
  {
    id: "notifications",
    label: "Notifications",
    content: <Notifications />,
  },
  {
    id: "upcoming",
    label: "Upcoming",
    content: <Upcoming />,
  },
  {
    id: "settings",
    label: "Settings",
    content: <Settings />,
  },
];

const Popup = () => {
  // Clear batch text whenever popup opens
  useEffect(() => {
    clearBatchText();
  }, []);

  return (
    <div className="w-[450px] h-[600px]">
      <Tabs tabs={tabs} />
    </div>
  );
};

export default Popup;
