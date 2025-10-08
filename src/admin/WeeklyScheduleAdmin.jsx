import React, { useState, useRef, useEffect } from "react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const employeeNames = [
  "SUONG SOVOTANAK", "HENG MENGLY", "POR KIMHUCHOR", "ORN TAK", "SOTH SOKLAY",
  "PHOEUN SOPHANY", "HENG THIRITH"
];

const shifts = [
  { label: "6:00am-4:36pm", start: "06:00", end: "16:36" },
  { label: "8:00am-5:36pm", start: "08:00", end: "17:36" },
  { label: "1:00pm-10:36pm", start: "13:00", end: "22:36" },
  { label: "11:00pm-6:36am", start: "23:00", end: "06:36" }
];

const getDaysInMonth = (month, year) => {
  // Safeguard against invalid inputs
  const validMonth = month || 0;
  const validYear = year || new Date().getFullYear();
  return new Date(validYear, validMonth + 1, 0).getDate();
};

const getWeekDates = (startDate) => {
  const dates = [];
  const start = new Date(startDate);
  // Adjust to the start of the week (Monday)
  start.setDate(start.getDate() - (start.getDay() || 7) + 1);
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push({ day: date.getDate(), month: date.getMonth(), year: date.getFullYear() });
  }
  return dates;
};

const getWeekday = (day, month, year) =>
  new Date(year, month, day).toLocaleDateString("en-US", { weekday: "short" });

const isWeekend = (day, month, year) => {
  const weekday = new Date(year, month, day).getDay();
  return weekday === 0 || weekday === 6;
};

const WeeklyScheduleAdmin = ({ setCurrentView }) => {
  const today = new Date();
  const tableRef = useRef(null);

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const start = new Date(today);
    start.setDate(today.getDate() - (today.getDay() || 7) + 1);
    return start;
  });
  const [selectedDate, setSelectedDate] = useState({
    day: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear()
  });
  const [tempDate, setTempDate] = useState(selectedDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const weekDates = getWeekDates(currentWeekStart);

  const initializeSchedule = () => {
    return weekDates.map(({ day, month, year }) => {
      const isWeekendDay = isWeekend(day, month, year);
      return employeeNames.map(() => ({
        start: isWeekendDay ? "" : "08:00",
        end: isWeekendDay ? "" : "17:36",
        status: isWeekendDay ? "off" : "work"
      }));
    });
  };

  const [schedule, setSchedule] = useState(initializeSchedule);
  const [editedCells, setEditedCells] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [editing, setEditing] = useState(false);
  const [tempShift, setTempShift] = useState({
    start: "08:00",
    end: "17:36",
    status: "work"
  });

  useEffect(() => {
    setSchedule(initializeSchedule());
    setEditedCells([]);
    setSelectedCells([]);
  }, [currentWeekStart]);

  const toggleSelectCell = (dayIndex, empIndex) => {
    if (dayIndex >= weekDates.length) return;
    const exists = selectedCells.some(c => c.day === dayIndex && c.emp === empIndex);
    if (exists) {
      setSelectedCells(selectedCells.filter(c => c.day !== dayIndex || c.emp !== empIndex));
    } else {
      setSelectedCells([...selectedCells, { day: dayIndex, emp: empIndex }]);
    }
  };

  const openEditPopup = () => {
    if (!selectedCells.length) return;
    const validSelectedCells = selectedCells.filter(cell => cell.day < weekDates.length);
    if (!validSelectedCells.length) {
      setSelectedCells([]);
      return;
    }
    const { day, emp } = validSelectedCells[0];
    if (day >= weekDates.length || emp >= employeeNames.length) {
      setSelectedCells([]);
      return;
    }
    const cell = schedule[day][emp];
    setTempShift({
      start: cell.start || "08:00",
      end: cell.end || "17:36",
      status: cell.status
    });
    setEditing(true);
  };

  const applyShift = () => {
    if (!selectedCells.length) return;
    const validSelectedCells = selectedCells.filter(cell => cell.day < weekDates.length);
    if (!validSelectedCells.length) {
      setSelectedCells([]);
      return;
    }

    const newSchedule = schedule.map(d => d.map(e => ({ ...e })));
    const newEditedCells = [...editedCells];

    validSelectedCells.forEach(({ day, emp }) => {
      if (day < newSchedule.length && emp < employeeNames.length) {
        newSchedule[day][emp] = {
          start: tempShift.status === "off" ? "" : tempShift.start,
          end: tempShift.status === "off" ? "" : tempShift.end,
          status: tempShift.status
        };
        if (!editedCells.some(c => c.day === day && c.emp === emp)) {
          newEditedCells.push({ day, emp });
        }
      }
    });

    setSchedule(newSchedule);
    setEditedCells(newEditedCells);
    setSelectedCells([]);
    setEditing(false);
  };

  const toggleDayOff = () => {
    setTempShift(prev => ({
      ...prev,
      status: prev.status === "off" ? "work" : "off",
      start: prev.status === "off" ? prev.start || "08:00" : "",
      end: prev.status === "off" ? prev.end || "17:36" : ""
    }));
  };

  const prevWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newStart);
    // Reset selected date to the first day of the new week
    const newWeekDates = getWeekDates(newStart);
    setSelectedDate({
      day: newWeekDates[0].day,
      month: newWeekDates[0].month,
      year: newWeekDates[0].year
    });
  };

  const nextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newStart);
    // Reset selected date to the first day of the new week
    const newWeekDates = getWeekDates(newStart);
    setSelectedDate({
      day: newWeekDates[0].day,
      month: newWeekDates[0].month,
      year: newWeekDates[0].year
    });
  };

  const goToToday = () => {
    const start = new Date(today);
    start.setDate(today.getDate() - (today.getDay() || 7) + 1);
    setCurrentWeekStart(start);
    setSelectedDate({
      day: today.getDate(),
      month: today.getMonth(),
      year: today.getFullYear()
    });
  };

  const selectDateDone = () => {
    // Simplified validation (day is now always valid due to resets)
    const maxDays = getDaysInMonth(tempDate.month, tempDate.year);
    const validDay = Math.min(tempDate.day || 1, maxDays);
    const newDate = {
      day: validDay,
      month: tempDate.month || 0,
      year: tempDate.year || today.getFullYear()
    };
    setSelectedDate(newDate);
    const newWeekStart = new Date(newDate.year, newDate.month, validDay);
    newWeekStart.setDate(validDay - (newWeekStart.getDay() || 7) + 1);
    setCurrentWeekStart(newWeekStart);
    setShowDatePicker(false);
  };

  useEffect(() => {
    if (!tableRef.current) return;
    const ths = tableRef.current.querySelectorAll("thead th");
    const selectedDayIndex = weekDates.findIndex(
      d => d.day === selectedDate.day && d.month === selectedDate.month && d.year === selectedDate.year
    );
    // Adjust for 0-based index and account for the first column (IGS Team)
    const headerIndex = selectedDayIndex + 1;
    if (ths[headerIndex] && selectedDayIndex >= 0) {
      ths[headerIndex].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      });
    }
  }, [selectedDate, weekDates]);

  // Safeguards for tempDate in date picker (prevent empty/invalid grids)
  const tempMonthForDays = tempDate.month !== undefined ? tempDate.month : today.getMonth();
  const tempYearForDays = tempDate.year !== undefined ? tempDate.year : today.getFullYear();
  const daysInTempMonth = getDaysInMonth(tempMonthForDays, tempYearForDays);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-gray-200 p-3 md:p-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center justify-between mb-2 md:mb-0">
          <button
            onClick={() => setCurrentView("dashboard")}
            className="text-red-500 font-medium text-sm md:text-base"
          >
            ← Back
          </button>
          <h1 className="text-base md:text-xl font-bold text-red-500 mx-2 text-center flex-1">
            Week of {months[weekDates[0].month]} {weekDates[0].day}, {weekDates[0].year}
          </h1>
          <div className="w-12 md:w-16"></div>
        </div>
        
        <div className="flex gap-2 justify-center mt-2 flex-wrap">
          <button
            onClick={() => setShowDatePicker(true)}
            className="bg-red-500 text-white px-3 py-1.5 rounded text-sm md:text-base hover:bg-red-600 transition"
          >
            Select Date
          </button>
          <button 
            onClick={prevWeek} 
            className="bg-gray-300 px-3 py-1.5 rounded text-sm md:text-base hover:bg-gray-400 transition"
          >
            Prev
          </button>
          <button 
            onClick={nextWeek} 
            className="bg-gray-300 px-3 py-1.5 rounded text-sm md:text-base hover:bg-gray-400 transition"
          >
            Next
          </button>
          <button 
            onClick={goToToday} 
            className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm md:text-base hover:bg-blue-600 transition"
          >
            Today
          </button>
          {selectedCells.length > 0 && (
            <button
              onClick={openEditPopup}
              className="bg-red-500 text-white px-3 py-1.5 rounded text-sm md:text-base hover:bg-red-600 transition"
            >
              Edit ({selectedCells.length})
            </button>
          )}
        </div>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
            <h2 className="text-lg font-semibold text-center p-4 border-b">
              Select Date
            </h2>
            
            <div className="flex-1 overflow-y-auto p-4">
              {/* Year Selection */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2 text-gray-700">Year</h3>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 20 }, (_, i) => 2015 + i).map(year => (
                    <button
                      key={year}
                      onClick={() => setTempDate({ ...tempDate, year, day: 1 })} // Reset day to 1 on year change
                      className={`px-3 py-2 rounded text-sm transition ${
                        tempDate.year === year
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month Selection */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2 text-gray-700">Month</h3>
                <div className="grid grid-cols-3 gap-2">
                  {months.map((m, idx) => (
                    <button
                      key={m}
                      onClick={() => setTempDate({ ...tempDate, month: idx, day: 1 })} // Reset day to 1 on month change
                      className={`px-3 py-2 rounded text-sm transition ${
                        tempDate.month === idx
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Selection */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700">Day</h3>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from(
                    { length: daysInTempMonth },
                    (_, i) => i + 1
                  ).map(day => (
                    <button
                      key={day}
                      onClick={() => setTempDate({ ...tempDate, day })}
                      className={`p-2 rounded text-sm transition ${
                        tempDate.day === day
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <button
                onClick={selectDateDone}
                className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Table */}
      <div className="overflow-x-auto p-2 md:p-4" ref={tableRef}>
        <table className="border-collapse border border-gray-300 w-max min-w-full bg-white">
          <thead>
            <tr className="bg-red-500 text-white">
              <th className="border border-gray-300 px-2 py-2 md:px-3 md:py-2 sticky left-0 bg-red-500 z-20 text-xs md:text-sm min-w-[100px] md:min-w-[120px]">
                IGS Team
              </th>
              {weekDates.map(({ day, month, year }, i) => {
                const weekday = getWeekday(day, month, year);
                const monthShort = months[month].slice(0, 3);
                const isToday = day === today.getDate() && 
                               month === today.getMonth() && 
                               year === today.getFullYear();
                const isWeekendDay = isWeekend(day, month, year);
                const isSelected = day === selectedDate.day && 
                                  month === selectedDate.month && 
                                  year === selectedDate.year;
                
                return (
                  <th
                    key={i}
                    className={`border border-gray-300 px-2 py-2 md:px-3 md:py-2 text-center text-xs md:text-sm min-w-[80px] md:min-w-[100px] ${
                      isSelected ? "bg-yellow-400 text-black" : ""
                    } ${isToday && !isSelected ? "bg-gray-300 text-black" : ""} ${
                      isWeekendDay && !isSelected && !isToday ? "bg-red-200 text-red-900" : ""
                    }`}
                  >
                    <div>{weekday}</div>
                    <div>{day} {monthShort}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {employeeNames.map((name, empIndex) => (
              <tr key={empIndex}>
                <td className="border border-gray-300 px-2 py-2 md:px-3 md:py-2 font-semibold sticky left-0 bg-white z-10 text-xs md:text-sm">
                  {name}
                </td>
                {weekDates.map(({ day, month, year }, dayIndex) => {
                  if (dayIndex >= schedule.length) return null;
                  
                  const cell = schedule[dayIndex]?.[empIndex] || {
                    start: "08:00",
                    end: "17:36",
                    status: "work"
                  };
                  
                  const isWeekendDay = isWeekend(day, month, year);
                  const isSelected = selectedCells.some(c => c.day === dayIndex && c.emp === empIndex);
                  const isColumnSelected = day === selectedDate.day && 
                                          month === selectedDate.month && 
                                          year === selectedDate.year;
                  const isEdited = editedCells.some(c => c.day === dayIndex && c.emp === empIndex);
                  const isToday = day === today.getDate() && 
                                 month === today.getMonth() && 
                                 year === today.getFullYear();
                  const text = cell.status === "off" ? "Day Off" : `${cell.start}-${cell.end}`;
                  
                  return (
                    <td
                      key={dayIndex}
                      onClick={() => toggleSelectCell(dayIndex, empIndex)}
                      className={`border border-gray-300 px-2 py-2 md:px-3 md:py-2 text-center cursor-pointer text-xs md:text-sm ${
                        isSelected ? "bg-blue-500 text-white" : ""
                      } ${isEdited && !isSelected ? "bg-yellow-200" : ""} ${
                        isColumnSelected && !isSelected && !isEdited ? "bg-yellow-100" : ""
                      } ${isToday && !isColumnSelected && !isSelected && !isEdited ? "bg-gray-200" : ""} ${
                        !isSelected && !isEdited && !isColumnSelected && !isToday && (cell.status === "off" || isWeekendDay)
                          ? "bg-red-50 text-red-800"
                          : ""
                      } ${
                        !isSelected && !isEdited && !isColumnSelected && !isToday && cell.status !== "off" && !isWeekendDay
                          ? "bg-green-50 text-green-800"
                          : ""
                      }`}
                    >
                      {text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Popup */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xs">
            <h2 className="font-bold text-lg mb-4 text-center">Edit Selected Cells</h2>
            <div className="flex flex-col gap-2 mb-4">
              {shifts.map(shift => (
                <button
                  key={shift.label}
                  onClick={() => setTempShift({ ...shift, status: "work" })}
                  className={`px-4 py-2 rounded transition ${
                    tempShift.start === shift.start &&
                    tempShift.end === shift.end &&
                    tempShift.status !== "off"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {shift.label}
                </button>
              ))}
            </div>
            <button
              onClick={toggleDayOff}
              className={`w-full px-4 py-2 rounded mb-4 transition ${
                tempShift.status === "off"
                  ? "bg-gray-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {tempShift.status === "off" ? "✓ Day Off" : "Day Off"}
            </button>
            <div className="flex gap-2">
              <button
                onClick={applyShift}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Apply
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyScheduleAdmin;