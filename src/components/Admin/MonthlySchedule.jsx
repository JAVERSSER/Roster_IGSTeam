import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const MonthlySchedule = ({ selectedDate, setSelectedDate, setCurrentView }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(selectedDate);

  const daysInMonth = getDaysInMonth(selectedDate.month, selectedDate.year);
  const [schedule, setSchedule] = useState(
    Array.from({ length: daysInMonth }, () => ({
      start: "08:00",
      end: "17:36",
      dayOff: false
    }))
  );

  const dayRefs = useRef([]);

  useEffect(() => {
    if (dayRefs.current[selectedDate.day - 1]) {
      dayRefs.current[selectedDate.day - 1].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedDate]);

  const handleTimeChange = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  const handleDayOffToggle = (index) => {
    const newSchedule = [...schedule];
    newSchedule[index].dayOff = !newSchedule[index].dayOff;
    setSchedule(newSchedule);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky Header */}
      <div className="bg-gray-200 p-4 flex items-center sticky top-0 z-50">
        <button
          onClick={() => setCurrentView("dashboard")}
          className="mr-3 text-red-500"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-red-500 flex-1 text-center">
          {months[selectedDate.month]} {selectedDate.year}
        </h1>
        <button
          onClick={() => {
            const today = new Date();
            setTempDate({
              day: today.getDate(),
              month: today.getMonth(),
              year: today.getFullYear(),
            });
            setShowDatePicker(true);
          }}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Select Date
        </button>
      </div>

      {/* Date Picker */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-center p-4 border-b">
              Select Date
            </h2>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col">
              {/* Year Selection */}
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {Array.from({ length: 20 }, (_, i) => 2015 + i).map((year) => (
                  <button
                    key={year}
                    onClick={() => setTempDate({ ...tempDate, year })}
                    className={`px-3 py-2 rounded ${tempDate.year === year ? "bg-red-500 text-white" : "bg-gray-200"}`}
                  >
                    {year}
                  </button>
                ))}
              </div>

              {/* Month Selection */}
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {months.map((m, idx) => (
                  <button
                    key={m}
                    onClick={() => setTempDate({ ...tempDate, month: idx })}
                    className={`px-3 py-2 rounded ${tempDate.month === idx ? "bg-red-500 text-white" : "bg-gray-200"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Day Selection */}
              <div className="grid grid-cols-7 gap-2 mb-4 justify-center">
                {Array.from({ length: getDaysInMonth(tempDate.month, tempDate.year) }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    onClick={() => setTempDate({ ...tempDate, day })}
                    className={`p-2 rounded ${tempDate.day === day ? "bg-red-500 text-white" : "bg-gray-200"}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Done Button */}
            <div className="p-4 border-t">
              <button
                onClick={() => { setSelectedDate(tempDate); setShowDatePicker(false); }}
                className="w-full px-6 py-2 bg-red-500 text-white rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Schedule */}
      <div className="p-4 max-w-md mx-auto space-y-4">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = new Date(selectedDate.year, selectedDate.month, i + 1);
          const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
          const daySchedule = schedule[i];

          return (
            <div
              key={i}
              ref={(el) => (dayRefs.current[i] = el)}
              className={`rounded-lg p-3 shadow-md ${
                selectedDate.day === i + 1 ? "bg-red-400 text-white" : "bg-red-600 text-white"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{dayName}, {i + 1}</span>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={daySchedule.dayOff}
                    onChange={() => handleDayOffToggle(i)}
                  />
                  <span>Day Off</span>
                </label>
              </div>

              {!daySchedule.dayOff && (
                <div className="flex space-x-2">
                  <input
                    type="time"
                    value={daySchedule.start}
                    onChange={(e) => handleTimeChange(i, "start", e.target.value)}
                    className="flex-1 rounded px-2 py-1 text-black"
                  />
                  <span className="flex items-center">→</span>
                  <input
                    type="time"
                    value={daySchedule.end}
                    onChange={(e) => handleTimeChange(i, "end", e.target.value)}
                    className="flex-1 rounded px-2 py-1 text-black"
                  />
                </div>
              )}

              {daySchedule.dayOff && (
                <div className="text-center text-gray-200 font-semibold">Day Off</div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center mt-4 text-red-500 font-semibold">
        Selected: {new Date(selectedDate.year, selectedDate.month, selectedDate.day).toDateString()}
      </p>
    </div>
  );
};

export default MonthlySchedule;
