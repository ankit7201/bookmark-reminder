import React, { useState, useEffect } from "react";
import { Clock, Power, Bell, ChevronDown, Save } from "lucide-react";
import { ExtensionState } from "../types/ExtensionState";
import {
  getBookmarkReminderDuration,
  getExtensionState,
  getReminderDurationTimeUnit,
  setExtensionState,
  setReminderDurationTimeUnit,
  updateBookmarkReminderTime,
} from "../chrome/storage";
import {
  convertDaysToMilliseconds,
  convertHoursToMilliseconds,
  convertMillisecondsToDays,
  convertMillisecondsToHours,
  convertMillisecondsToMinutes,
  convertMinutesToMilliseconds,
} from "../utils/date";

type TimeUnit = "minutes" | "hours" | "days";

interface Settings {
  isEnabled: boolean;
  duration: string;
  timeUnit: TimeUnit;
}

const Settings: React.FC = () => {
  // Track both current and saved settings
  const [settings, setSettings] = useState<Settings>({
    isEnabled: true,
    duration: "",
    timeUnit: "days",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  // Load settings from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      const isEnabled =
        (await getExtensionState()) === ExtensionState.ENABLED ? true : false;
      const timeUnit = await getReminderDurationTimeUnit();
      const durationInMs = await getBookmarkReminderDuration();
      let duration = "";

      if (timeUnit === "days") {
        duration = String(convertMillisecondsToDays(durationInMs));
      } else if (timeUnit == "hours") {
        duration = String(convertMillisecondsToHours(durationInMs));
      } else if (timeUnit === "minutes") {
        duration = String(convertMillisecondsToMinutes(durationInMs));
      }

      try {
        const settings: Settings = {
          isEnabled: isEnabled,
          duration: duration,
          timeUnit: timeUnit,
        };

        setSettings(settings);
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  // Update settings handlers
  const handleToggle = () => {
    setSettings((prev) => ({ ...prev, isEnabled: !prev.isEnabled }));
    setHasChanges(true);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setSettings((prev) => ({ ...prev, duration: value }));
      setHasChanges(true);
    }
  };

  const handleTimeUnitChange = (unit: TimeUnit) => {
    setSettings((prev) => ({ ...prev, timeUnit: unit }));
    setIsDropdownOpen(false);
    setHasChanges(true);
  };

  // Save all settings
  const handleSave = async () => {
    setSaveStatus("saving");

    const isEnabled = settings.isEnabled;
    const timeUnit = settings.timeUnit;
    const duration = settings.duration;
    let durationInMs = 0;

    if (timeUnit == "days") {
      durationInMs = convertDaysToMilliseconds(Number(duration));
    } else if (timeUnit == "minutes") {
      durationInMs = convertMinutesToMilliseconds(Number(duration));
    } else if (timeUnit == "hours") {
      durationInMs = convertHoursToMilliseconds(Number(duration));
    }

    await setExtensionState(
      isEnabled ? ExtensionState.ENABLED : ExtensionState.DISABLED,
    );
    await setReminderDurationTimeUnit(timeUnit);
    await updateBookmarkReminderTime(durationInMs);

    setSaveStatus("saved");
    setHasChanges(false);
    setTimeout(() => {
      setSaveStatus("idle");
    }, 1000);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDropdownOpen && !target.closest(".time-unit-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <div className="p-8">
      <div className="w-full max-w-md mx-auto bg-white p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
          <Bell className="w-6 h-6 text-indigo-500" />
          <h1 className="text-xl font-semibold text-gray-800">
            Reminder Settings
          </h1>
        </div>

        <div className="space-y-6">
          {/* Extension Toggle */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-gray-100">
            <div className="flex items-center space-x-3">
              <Power
                className={`w-5 h-5 ${settings.isEnabled ? "text-green-500" : "text-gray-400"}`}
              />
              <label className="text-sm font-medium text-gray-700">
                Listen to new added bookmarks
              </label>
            </div>
            <button
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                settings.isEnabled ? "bg-indigo-500" : "bg-gray-200"
              }`}
              aria-pressed={settings.isEnabled}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                  settings.isEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Reminder Duration */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-indigo-500" />
              <label className="text-sm font-medium text-gray-700">
                Reminder Interval
              </label>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={settings.duration}
                  onChange={handleDurationChange}
                  placeholder="Enter duration"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  aria-label="Duration value"
                />
              </div>

              <div className="relative time-unit-dropdown">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-32 px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                >
                  <span className="text-gray-700">{settings.timeUnit}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10"
                    role="listbox"
                  >
                    {(["minutes", "hours", "days"] as TimeUnit[]).map(
                      (unit) => (
                        <button
                          key={unit}
                          onClick={() => handleTimeUnitChange(unit)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 focus:outline-none capitalize"
                          role="option"
                          aria-selected={settings.timeUnit === unit}
                        >
                          {unit}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-sm text-center text-gray-500">
            {settings.isEnabled ? (
              <p className="flex items-center justify-center space-x-1">
                <Bell className="w-4 h-4" />
                <span>
                  All new bookmarks will have their reminder in{" "}
                  {settings.duration || "0"} {settings.timeUnit}
                </span>
              </p>
            ) : (
              <p className="flex items-center justify-center space-x-1">
                <Power className="w-4 h-4" />
                <span>Extension is currently disabled</span>
              </p>
            )}
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={!hasChanges || saveStatus === "saving"}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 
                ${
                  hasChanges
                    ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              <Save className="w-4 h-4" />
              <span>
                {saveStatus === "saving" && "Saving..."}
                {saveStatus === "saved" && "Saved!"}
                {saveStatus === "error" && "Error saving"}
                {saveStatus === "idle" && "Save Changes"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
