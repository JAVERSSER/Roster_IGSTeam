import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const WeeklySchedule = ({ setCurrentView }) => {
  // Initialize schedule for each day
  const [schedule, setSchedule] = useState(
    weekdays.map(() => ({ start: "08:00", end: "17:36", dayOff: false }))
  );

  // Client view is read-only: handlers are no-ops to prevent client-side edits
  const handleTimeChange = () => {};
  const handleDayOffToggle = () => {};

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky Header */}
      <div className="bg-gray-200 p-4 flex items-center sticky top-0 z-50 shadow-md">
        <button
          onClick={() => setCurrentView("dashboard")}
          className="mr-3 text-red-500"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-red-500 flex-1 text-center">
          Weekly Schedule
        </h1>
      </div>

      {/* Schedule Editor */}
      <div className="p-4 max-w-md mx-auto space-y-4 overflow-y-auto">
        {weekdays.map((day, index) => (
          <div
            key={day}
            className={`flex flex-col rounded-lg p-3 shadow-md ${
              schedule[index].dayOff ? "bg-red-400 text-white" : "bg-red-600 text-white"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{day}</span>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={schedule[index].dayOff}
                  onChange={() => {}}
                  disabled
                />
                <span>Day Off</span>
              </label>
            </div>

            {!schedule[index].dayOff && (
              <div className="flex space-x-2">
                <input
                  type="time"
                  value={schedule[index].start}
                  onChange={() => {}}
                  disabled
                  className="flex-1 rounded px-2 py-1 text-black bg-gray-200 cursor-not-allowed"
                />
                <span className="flex items-center">→</span>
                <input
                  type="time"
                  value={schedule[index].end}
                  onChange={() => {}}
                  disabled
                  className="flex-1 rounded px-2 py-1 text-black bg-gray-200 cursor-not-allowed"
                />
              </div>
            )}

            {schedule[index].dayOff && (
              <div className="text-center text-gray-200 font-semibold">Day Off</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklySchedule;
