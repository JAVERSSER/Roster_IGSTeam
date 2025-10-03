import React, { useState, useRef, useEffect } from "react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const employeeNames = [
  // "LEONG IN LAI",
  // "KHA MAKARA","SIVAKUMAR","NGOUN PHANNY",
  // "NGET SAMBO","CHOUB SREYLEAKHENA","CHHOEUN TY"
  "SUONG SOVOTANAK","HENG MENGLY","POR KIMHUCHOR","ORN TAK","SOTH SOKLAY",
  "PHOEUN SOPHANY","HENG THIRITH",
];

const shifts = [
  { label: "6:00am-4:36pm", start: "06:00", end: "16:36" },
  { label: "8:00am-5:36pm", start: "08:00", end: "17:36" },
  { label: "1:00pm-10:36pm", start: "13:00", end: "22:36" },
  { label: "11:00pm-6:36am", start: "23:00", end: "06:36" },
];

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
const getWeekday = (day, month, year) =>
  new Date(year, month, day).toLocaleDateString("en-US", { weekday: "short" });

const isWeekend = (day, month, year) => {
  const weekday = new Date(year, month, day).getDay();
  return weekday === 0 || weekday === 6; // 0 = Sunday, 6 = Saturday
};

const MonthlyScheduleAdmin = ({ setCurrentView }) => {
  const today = new Date();
  const tableRef = useRef(null);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  const [selectedDate, setSelectedDate] = useState({
    day: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear(),
  });
  const [tempDate, setTempDate] = useState(selectedDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  // Initialize schedule with weekends as day off by default
  const initializeSchedule = () => {
    return Array.from({ length: daysInMonth }, (_, dayIndex) => {
      const day = dayIndex + 1;
      const isWeekendDay = isWeekend(day, currentMonth, currentYear);
      
      return employeeNames.map(() => ({
        start: isWeekendDay ? "" : "08:00",
        end: isWeekendDay ? "" : "17:36",
        status: isWeekendDay ? "off" : "work",
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
    status: "work",
  });

  // Update schedule when month/year changes
  useEffect(() => {
    const newSchedule = initializeSchedule();
    setSchedule(newSchedule);
    setEditedCells([]);
    setSelectedCells([]);
  }, [currentMonth, currentYear]);

  // Select / deselect table cell
  const toggleSelectCell = (dayIndex, empIndex) => {
    if (dayIndex >= schedule.length) return;
    
    const exists = selectedCells.some(
      (c) => c.day === dayIndex && c.emp === empIndex
    );
    if (exists)
      setSelectedCells(
        selectedCells.filter((c) => c.day !== dayIndex || c.emp !== empIndex)
      );
    else setSelectedCells([...selectedCells, { day: dayIndex, emp: empIndex }]);
  };

  // Open Edit popup
  const openEditPopup = () => {
    if (!selectedCells.length) return;
    
    const validSelectedCells = selectedCells.filter(cell => cell.day < schedule.length);
    if (!validSelectedCells.length) {
      setSelectedCells([]);
      return;
    }
    
    const { day, emp } = validSelectedCells[0];
    
    if (day >= schedule.length || emp >= employeeNames.length) {
      setSelectedCells([]);
      return;
    }
    
    const cell = schedule[day][emp];
    setTempShift({
      start: cell.start || "08:00",
      end: cell.end || "17:36",
      status: cell.status,
    });
    setEditing(true);
  };

  // Apply shift
  const applyShift = () => {
    if (!selectedCells.length) return;

    const validSelectedCells = selectedCells.filter(cell => cell.day < schedule.length);
    if (!validSelectedCells.length) {
      setSelectedCells([]);
      return;
    }

    const newSchedule = schedule.map((d) => d.map((e) => ({ ...e })));
    const newEditedCells = [...editedCells];

    validSelectedCells.forEach(({ day, emp }) => {
      if (day < newSchedule.length && emp < employeeNames.length) {
        newSchedule[day][emp] = {
          start: tempShift.status === "off" ? "" : tempShift.start,
          end: tempShift.status === "off" ? "" : tempShift.end,
          status: tempShift.status,
        };

        if (!editedCells.some((c) => c.day === day && c.emp === emp)) {
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
    setTempShift((prev) => ({
      ...prev,
      status: prev.status === "off" ? "work" : "off",
      start: prev.status === "off" ? prev.start || "08:00" : "",
      end: prev.status === "off" ? prev.end || "17:36" : "",
    }));
  };

  // Month navigation functions
  const prevMonth = () => {
    setCurrentMonth(prev => {
      let newMonth = prev - 1;
      let newYear = currentYear;
      if (newMonth < 0) {
        newMonth = 11;
        newYear = currentYear - 1;
        setCurrentYear(newYear);
      }
      return newMonth;
    });
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      let newMonth = prev + 1;
      let newYear = currentYear;
      if (newMonth > 11) {
        newMonth = 0;
        newYear = currentYear + 1;
        setCurrentYear(newYear);
      }
      return newMonth;
    });
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate({
      day: today.getDate(),
      month: today.getMonth(),
      year: today.getFullYear(),
    });
  };

  // Scroll table to selected date column
  useEffect(() => {
    if (!tableRef.current) return;
    const ths = tableRef.current.querySelectorAll("thead th");
    if (ths[selectedDate.day]) {
      ths[selectedDate.day].scrollIntoView({
        behavior: "smooth",
        inline: "end",
      });
    }
  }, [selectedDate]);

  const selectDateDone = () => {
    setSelectedDate(tempDate);
    setCurrentMonth(tempDate.month);
    setCurrentYear(tempDate.year);
    setShowDatePicker(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar - Same styling as original */}
      <div className="bg-gray-200 p-4 flex items-center sticky top-0 z-50 shadow-md flex-wrap">
        <button
          onClick={() => setCurrentView("dashboard")}
          className="mr-3 text-red-500"
        >
          Back
        </button>
        <h1 className="text-xl font-bold text-red-500 flex-1 text-center">
          Monthly Schedule (Admin) - {months[currentMonth]} {currentYear}
        </h1>
        <div className="flex gap-2 flex-wrap mt-2 md:mt-0">
          <button
            onClick={() => setShowDatePicker(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
          >
            Select Date
          </button>
          <button onClick={prevMonth} className="bg-gray-300 px-2 py-1 rounded">
            Prev
          </button>
          <button onClick={nextMonth} className="bg-gray-300 px-2 py-1 rounded">
            Next
          </button>
          <button onClick={goToToday} className="bg-blue-500 text-white px-2 py-1 rounded">
            Today
          </button>
          {selectedCells.length > 0 && (
            <button
              onClick={openEditPopup}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Date Picker - Same styling as original */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-lg w-full max-w-md h-full max-h-[90vh] flex flex-col">
            <h2 className="text-lg font-semibold mb-2 text-center p-4 border-b">
              Select Date
            </h2>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col">
              {/* Year */}
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {Array.from({ length: 20 }, (_, i) => 2015 + i).map((year) => (
                  <button
                    key={year}
                    onClick={() => setTempDate({ ...tempDate, year })}
                    className={`px-3 py-2 rounded ${
                      tempDate.year === year
                        ? "bg-red-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
              {/* Month */}
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {months.map((m, idx) => (
                  <button
                    key={m}
                    onClick={() => setTempDate({ ...tempDate, month: idx })}
                    className={`px-3 py-2 rounded ${
                      tempDate.month === idx
                        ? "bg-red-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              {/* Day */}
              <div className="grid grid-cols-7 gap-2 mb-4 justify-center">
                {Array.from(
                  { length: getDaysInMonth(tempDate.month, tempDate.year) },
                  (_, i) => i + 1
                ).map((day) => (
                  <button
                    key={day}
                    onClick={() => setTempDate({ ...tempDate, day })}
                    className={`p-2 rounded ${
                      tempDate.day === day
                        ? "bg-red-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t flex-shrink-0">
              <button
                onClick={selectDateDone}
                className="w-full px-6 py-3 bg-red-500 text-white rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table - Same styling as original */}
      <div className="overflow-x-auto p-4" ref={tableRef}>
        <table className="border-collapse border border-gray-300 w-max min-w-full">
          <thead>
            <tr className="bg-red-500 text-white">
              <th className="border border-gray-300 px-3 py-2 sticky left-0 bg-red-500 z-20">
                IGS Team
              </th>
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const weekday = getWeekday(day, currentMonth, currentYear);
                const monthShort = months[currentMonth].slice(0, 3);
                const isToday = day === today.getDate() && 
                               currentMonth === today.getMonth() && 
                               currentYear === today.getFullYear();
                const isWeekendDay = isWeekend(day, currentMonth, currentYear);
                
                return (
                  <th
                    key={i}
                    className={`border border-gray-300 px-3 py-2 text-center ${
                      i === selectedDate.day - 1 && selectedDate.month === currentMonth && selectedDate.year === currentYear ? "bg-gray-300" : ""
                    } ${isToday ? "bg-gray-300 text-black" : ""} ${
                      isWeekendDay ? "bg-red-100 text-red-800 " : ""
                    }`}
                  >
                    {`${weekday} ${day} ${monthShort}`}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {employeeNames.map((name, empIndex) => (
              <tr key={empIndex}>
                <td className="border border-gray-300 px-3 py-2 font-semibold sticky left-0 bg-white z-10">
                  {name}
                </td>
                {Array.from({ length: daysInMonth }, (_, dayIndex) => {
                  if (dayIndex >= schedule.length) return null;
                  
                  const cell = schedule[dayIndex]?.[empIndex] || {
                    start: "08:00",
                    end: "17:36",
                    status: "work",
                  };
                  
                  const day = dayIndex + 1;
                  const isWeekendDay = isWeekend(day, currentMonth, currentYear);
                  const isSelected = selectedCells.some(
                    (c) => c.day === dayIndex && c.emp === empIndex
                  );
                  const isColumnSelected = dayIndex === selectedDate.day - 1 && selectedDate.month === currentMonth && selectedDate.year === currentYear;
                  const isEdited = editedCells.some(
                    (c) => c.day === dayIndex && c.emp === empIndex
                  );
                  const isToday = day === today.getDate() && 
                                 currentMonth === today.getMonth() && 
                                 currentYear === today.getFullYear();
                  const text =
                    cell.status === "off"
                      ? "Day Off"
                      : `${cell.start}-${cell.end}`;
                  
                  return (
                    <td
                      key={dayIndex}
                      onClick={() => toggleSelectCell(dayIndex, empIndex)}
                      className={`border border-gray-300 px-3 py-2 text-center cursor-pointer
                        ${isColumnSelected ? "bg-gray-300" : ""}
                        ${isEdited && !isSelected ? "bg-yellow-200" : ""}
                        ${isSelected ? "bg-red-500 text-white" : ""}
                        ${isToday && !isSelected ? "bg-gray-300 text-black" : ""}
                        ${
                          !isColumnSelected &&
                          !isSelected &&
                          !isEdited &&
                          !isToday &&
                          (cell.status === "off" || isWeekendDay)
                            ? "bg-red-100 text-red-800"
                            : ""
                        }
                        ${
                          !isColumnSelected &&
                          !isSelected &&
                          !isEdited &&
                          !isToday &&
                          cell.status !== "off" && !isWeekendDay
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      `}
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

      {/* Edit Popup - Same styling as original */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg flex flex-col items-center space-y-2 w-72">
            <h2 className="font-bold text-lg">Edit Selected Cells</h2>
            <div className="flex flex-col gap-1 w-full">
              {shifts.map((shift) => (
                <button
                  key={shift.label}
                  onClick={() => setTempShift({ ...shift, status: "work" })}
                  className={`px-2 py-1 rounded w-full ${
                    tempShift.start === shift.start &&
                    tempShift.end === shift.end &&
                    tempShift.status !== "off"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {shift.label}
                </button>
              ))}
            </div>
            <button
              onClick={toggleDayOff}
              className={`px-2 py-1 rounded w-full ${
                tempShift.status === "off"
                  ? "bg-gray-400 text-white"
                  : "bg-gray-200"
              }`}
            >
              Day Off
            </button>
            <div className="flex gap-2 mt-2 w-full">
              <button
                onClick={applyShift}
                className="bg-red-500 text-white px-3 py-1 rounded flex-1"
              >
                OK
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-300 px-3 py-1 rounded flex-1"
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

export default MonthlyScheduleAdmin;