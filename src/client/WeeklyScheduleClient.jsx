import React, { useState, useRef, useEffect } from "react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const employeeNames = [
  "SUONG SOVOTANAK", "HENG MENGLY", "POR KIMHUCHOR", "ORN TAK", "SOTH SOKLAY",
  "PHOEUN SOPHANY", "HENG THIRITH",
];

const shifts = [
  { label: "6:00am-4:36pm", start: "06:00", end: "16:36" },
  { label: "8:00am-5:36pm", start: "08:00", end: "17:36" },
  { label: "1:00pm-10:36pm", start: "13:00", end: "22:36" },
  { label: "11:00pm-6:36am", start: "23:00", end: "06:36" }
];

const getWeekday = (day, month, year) =>
  new Date(year, month, day).toLocaleDateString("en-US", { weekday: "short" });

const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
};

const getWeekDatesFromMonday = (mondayDate) => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + i);
    return { 
      day: d.getDate(), 
      month: d.getMonth(), 
      year: d.getFullYear(),
      weekday: d.getDay() // 0 = Sunday, 6 = Saturday
    };
  });
};

const isWeekend = (weekday) => weekday === 0 || weekday === 6;

const WeeklyScheduleClient = ({ setCurrentView }) => {
  const today = new Date();
  const tableRef = useRef(null);
  const headerRefs = useRef([]);

  const [currentMonday, setCurrentMonday] = useState(getMonday(today));
  const [firstLoad, setFirstLoad] = useState(true);

  const initializeSchedule = () => {
    const weekDates = getWeekDatesFromMonday(currentMonday);
    return weekDates.map((date) => {
      const isWeekendDay = isWeekend(date.weekday);
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

  const weekDates = getWeekDatesFromMonday(currentMonday);

  useEffect(() => {
    const newSchedule = initializeSchedule();
    setSchedule(newSchedule);
    setEditedCells([]);
    setSelectedCells([]);
  }, [currentMonday]);

  useEffect(() => {
    if (!firstLoad) return;
    const todayIndex = weekDates.findIndex(
      d => d.day === today.getDate() &&
           d.month === today.getMonth() &&
           d.year === today.getFullYear()
    );
    if (todayIndex !== -1 && headerRefs.current[todayIndex]) {
      headerRefs.current[todayIndex].scrollIntoView({ behavior: "smooth", inline: "end" });
    }
    setFirstLoad(false);
  }, [weekDates, firstLoad]);

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

  const prevWeek = () => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(newMonday.getDate() - 7);
    setCurrentMonday(newMonday);
  };

  const nextWeek = () => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(newMonday.getDate() + 7);
    setCurrentMonday(newMonday);
  };

  const goToToday = () => {
    setCurrentMonday(getMonday(today));
  };

  const getWeekRangeDisplay = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    return `${months[start.month]} ${start.day} - ${months[end.month]} ${end.day}, ${end.year}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-gray-200 p-4 flex items-center sticky top-0 z-50 shadow-md flex-wrap">
        <button
          onClick={() => setCurrentView("dashboard")}
          className="mr-3 text-red-500"
        >
          Back
        </button>
        <h1 className="text-xl font-bold text-red-500 flex-1 text-center">
          Weekly Schedule (Client) - {getWeekRangeDisplay()}
        </h1>
        {/* <div className="flex gap-2 flex-wrap mt-2 md:mt-0">
          <button onClick={prevWeek} className="bg-gray-300 px-2 py-1 rounded">
            Prev Week
          </button>
          <button onClick={nextWeek} className="bg-gray-300 px-2 py-1 rounded">
            Next Week
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
        </div> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-4" ref={tableRef}>
        <table className="border-collapse border border-gray-300 w-max min-w-full">
          <thead>
            <tr className="bg-red-500 text-white">
              <th className="border border-gray-300 px-3 py-2 sticky left-0 bg-red-500 z-20">
                IGS Team
              </th>
              {weekDates.map((date, i) => {
                const weekday = getWeekday(date.day, date.month, date.year);
                const monthShort = months[date.month].slice(0, 3);
                const isToday = date.day === today.getDate() &&
                                date.month === today.getMonth() &&
                                date.year === today.getFullYear();
                const isWeekendDay = isWeekend(date.weekday);
                
                return (
                  <th
                    key={i}
                    ref={el => (headerRefs.current[i] = el)}
                    className={`border border-gray-300 px-3 py-2 text-center ${
                      isToday ? "bg-gray-300 text-black" : ""
                    } ${isWeekendDay ? "bg-red-100 text-red-800" : ""}`}
                  >
                    {`${weekday} ${date.day} ${monthShort}`}
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
                {weekDates.map((date, dayIndex) => {
                  if (dayIndex >= schedule.length) return null;
                  const cell = schedule[dayIndex]?.[empIndex] || {
                    start: "08:00",
                    end: "17:36",
                    status: "work",
                  };
                  const isWeekendDay = isWeekend(date.weekday);
                  const isSelected = selectedCells.some(
                    (c) => c.day === dayIndex && c.emp === empIndex
                  );
                  const isEdited = editedCells.some(
                    (c) => c.day === dayIndex && c.emp === empIndex
                  );
                  const isToday = date.day === today.getDate() &&
                                  date.month === today.getMonth() &&
                                  date.year === today.getFullYear();
                  const text =
                    cell.status === "off"
                      ? "Day Off"
                      : `${cell.start}-${cell.end}`;
                  
                  return (
                    <td
                      key={dayIndex}
                      onClick={() => toggleSelectCell(dayIndex, empIndex)}
                      className={`border border-gray-300 px-3 py-2 text-center cursor-pointer
                        ${isEdited && !isSelected ? "bg-yellow-200" : ""}
                        ${isSelected ? "bg-red-500 text-white" : ""}
                        ${isToday && !isSelected ? "bg-gray-300 text-black" : ""}
                        ${
                          !isSelected &&
                          !isEdited &&
                          !isToday &&
                          (cell.status === "off" || isWeekendDay)
                            ? "bg-red-100 text-red-800"
                            : ""
                        }
                        ${
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

      {/* Edit Popup */}
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

export default WeeklyScheduleClient;
