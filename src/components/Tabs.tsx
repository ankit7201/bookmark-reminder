import React, { useState } from "react";
import { Tab } from "../types/Tab";

const Tabs = ({ tabs }: { tabs: Tab[] }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  return (
    <React.Fragment>
      <div className="mb-4  border-b border-gray-700">
        <ul className="flex text-sm font-medium text-center">
          {tabs.map((tab, _index) => (
            <li key={tab.id}>
              <button
                className={`p-4 ml-2 ${activeTab === tab.id ? "text-blue-600 border-b-2" : "hover:text-gray-600 hover:border-b-2"}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${activeTab === tab.id ? "block" : "hidden"}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default Tabs;
