import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const employeeNames = [
  "SUONG SOVOTANAK",
  "HENG MENGLY",
  "POR KIMHUCHOR",
  "ORN TAK",
  "SOTH SOKLAY",
  "PHOEUN SOPHANY",
  "HENG THIRITH",
];

const shifts = [
  { label: "6:00am-4:36pm", start: "06:00", end: "16:36" },
  { label: "8:00am-5:36pm", start: "08:00", end: "17:36" },
  { label: "1:00pm-10:36pm", start: "13:00", end: "22:36" },
];

const getDaysInMonth = (month, year) => {
  return new Date(year || new Date().getFullYear(), (month || 0) + 1, 0).getDate();
};

const getWeekDates = (startDate) => {
  const dates = [];
  const start = new Date(startDate);
  start.setDate(start.getDate() - (start.getDay() || 7) + 1); // Monday start
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push({
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
    });
  }
  return dates;
};

const getWeekday = (day, month, year) =>
  new Date(year, month, day).toLocaleDateString("en-US", { weekday: "short" });

const isWeekend = (day, month, year) => {
  const weekday = new Date(year, month, day).getDay();
  return weekday === 0 || weekday === 6; // 0 = Sunday, 6 = Saturday
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
    year: today.getFullYear(),
  });

  const [tempDate, setTempDate] = useState(selectedDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [editedCells, setEditedCells] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [editing, setEditing] = useState(false);
  const [tempShift, setTempShift] = useState({
    start: "06:00",
    end: "16:36",
    status: "work",
  });

  const weekDates = getWeekDates(currentWeekStart);

  const initializeSchedule = () => {
    return weekDates.map(({ day, month, year }) => {
      const weekend = isWeekend(day, month, year);
      return employeeNames.map(() => ({
        start: weekend ? "" : "06:00",
        end: weekend ? "" : "16:36",
        status: weekend ? "off" : "work",
      }));
    });
  };

  useEffect(() => {
    setSchedule(initializeSchedule());
    setEditedCells([]);
    setSelectedCells([]);
  }, [currentWeekStart]);

  const toggleSelectCell = (dayIndex, empIndex) => {
    const exists = selectedCells.some((c) => c.day === dayIndex && c.emp === empIndex);
    if (exists) {
      setSelectedCells(selectedCells.filter((c) => c.day !== dayIndex || c.emp !== empIndex));
    } else {
      setSelectedCells([...selectedCells, { day: dayIndex, emp: empIndex }]);
    }
  };

  const openEditPopup = () => {
    if (!selectedCells.length) return;
    const first = selectedCells[0];
    const cell = schedule[first.day]?.[first.emp] || { start: "06:00", end: "16:36", status: "work" };
    setTempShift({
      start: cell.start || "06:00",
      end: cell.end || "16:36",
      status: cell.status,
    });
    setEditing(true);
  };

  const applyShift = () => {
    if (!selectedCells.length) return;

    const newSchedule = schedule.map((d) => d.map((e) => ({ ...e })));
    const newEdited = [...editedCells];

    selectedCells.forEach(({ day, emp }) => {
      if (day < newSchedule.length && emp < employeeNames.length) {
        newSchedule[day][emp] = {
          start: tempShift.status === "off" ? "" : tempShift.start,
          end: tempShift.status === "off" ? "" : tempShift.end,
          status: tempShift.status,
        };
        if (!newEdited.some((c) => c.day === day && c.emp === emp)) {
          newEdited.push({ day, emp });
        }
      }
    });

    setSchedule(newSchedule);
    setEditedCells(newEdited);
    setSelectedCells([]);
    setEditing(false);
  };

  const toggleDayOff = () => {
    setTempShift((prev) => ({
      ...prev,
      status: prev.status === "off" ? "work" : "off",
      start: prev.status === "off" ? (prev.start || "06:00") : "",
      end: prev.status === "off" ? (prev.end || "16:36") : "",
    }));
  };

  const generateRandomSchedule = () => {
    const newSchedule = weekDates.map(() => Array(employeeNames.length).fill(null));
    const newEdited = [];

    // Each employee works 5 days
    const workDaysPerEmp = employeeNames.map(() => {
      let days = [0,1,2,3,4,5,6];
      days.sort(() => Math.random() - 0.5);
      return days.slice(0, 5);
    });

    weekDates.forEach((_, dayIndex) => {
      const isWeekendDay = isWeekend(weekDates[dayIndex].day, weekDates[dayIndex].month, weekDates[dayIndex].year);
      let workers = [];

      employeeNames.forEach((_, emp) => {
        if (workDaysPerEmp[emp].includes(dayIndex)) workers.push(emp);
      });

      if (isWeekendDay) {
        // Ensure exactly 3 workers on weekend
        while (workers.length < 3) {
          let added = false;
          for (let emp = 0; emp < employeeNames.length; emp++) {
            if (!workDaysPerEmp[emp].includes(dayIndex) && workDaysPerEmp[emp].length < 5) {
              workDaysPerEmp[emp].push(dayIndex);
              workers.push(emp);
              added = true;
              break;
            }
          }
          if (!added) break; // prevent infinite loop
        }
      } else {
        // Weekday: exactly 1 worker
        if (workers.length !== 1) {
          workers = [];
          const possible = [];
          employeeNames.forEach((_, emp) => {
            if (workDaysPerEmp[emp].includes(dayIndex)) possible.push(emp);
          });
          if (possible.length > 0) {
            workers = [possible[Math.floor(Math.random() * possible.length)]];
          } else {
            // fallback
            const emp = Math.floor(Math.random() * employeeNames.length);
            workers = [emp];
            workDaysPerEmp[emp].push(dayIndex);
          }
        }
      }

      // Assign shifts
      weekDates.forEach((_, dIdx) => { /* reset if needed */ });
      employeeNames.forEach((_, empIndex) => {
        const isWorking = workers.includes(empIndex);
        if (isWorking) {
          let assignedShift;
          if (isWeekendDay) {
            const shiftIdx = workers.indexOf(empIndex) % 3;
            assignedShift = shifts[shiftIdx];
          } else {
            assignedShift = shifts[0]; // morning only on weekdays
          }
          newSchedule[dayIndex][empIndex] = {
            start: assignedShift.start,
            end: assignedShift.end,
            status: "work",
          };
        } else {
          newSchedule[dayIndex][empIndex] = { start: "", end: "", status: "off" };
        }
        newEdited.push({ day: dayIndex, emp: empIndex });
      });
    });

    setSchedule(newSchedule);
    setEditedCells(newEdited);
    setSelectedCells([]);
  };

  const prevWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const nextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const goToToday = () => {
    const start = new Date(today);
    start.setDate(today.getDate() - (today.getDay() || 7) + 1);
    setCurrentWeekStart(start);
    setSelectedDate({
      day: today.getDate(),
      month: today.getMonth(),
      year: today.getFullYear(),
    });
  };

  const selectDateDone = () => {
    const year = tempDate.year || today.getFullYear();
    const month = tempDate.month ?? today.getMonth();
    const maxDay = getDaysInMonth(month, year);
    const day = Math.min(tempDate.day || 1, maxDay);

    const newDate = { day, month, year };
    setSelectedDate(newDate);

    const newStart = new Date(year, month, day);
    newStart.setDate(day - (newStart.getDay() || 7) + 1);
    setCurrentWeekStart(newStart);

    setShowDatePicker(false);
  };

  const filenameBase = () => {
    const s = weekDates[0];
    return `schedule_${s.year}-${String(s.month + 1).padStart(2, "0")}-${String(s.day).padStart(2, "0")}`;
  };

  const exportCSV = () => {
    const headers = ["Name", ...weekDates.map(d => `${getWeekday(d.day, d.month, d.year)} ${d.day}/${d.month + 1}`)];
    const rows = employeeNames.map((name, emp) => {
      const row = [name];
      weekDates.forEach((_, dayIdx) => {
        const cell = schedule[dayIdx]?.[emp] || { status: "off" };
        row.push(cell.status === "off" ? "Day Off" : `${cell.start}-${cell.end}`);
      });
      return row;
    });

    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filenameBase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportImage = async () => {
    if (!tableRef.current) return;
    const canvas = await html2canvas(tableRef.current, { scale: 2 });
    const url = canvas.toDataURL("image/jpeg", 1.0);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filenameBase()}.jpg`;
    a.click();
  };

  const exportPDF = async () => {
    if (!tableRef.current) return;
    const canvas = await html2canvas(tableRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`${filenameBase()}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-gray-200 p-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setCurrentView("dashboard")} className="text-red-600 font-semibold">
            Back
          </button>
          <h1 className="text-xl font-bold text-red-600 flex-1 text-center">
            Week of {months[weekDates[0].month]} {weekDates[0].day}, {weekDates[0].year}
          </h1>
          <div className="w-16"></div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <button onClick={() => setShowDatePicker(true)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Select Date
          </button>
          <button onClick={prevWeek} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Prev</button>
          <button onClick={nextWeek} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Next</button>
          <button onClick={goToToday} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Today</button>
          <button onClick={generateRandomSchedule} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            🎲 Generate
          </button>

          <div className="flex gap-2 ml-4">
            <button onClick={exportCSV} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">CSV</button>
            <button onClick={exportImage} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">JPG</button>
            <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">PDF</button>
            {selectedCells.length > 0 && (
              <button onClick={openEditPopup} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Edit ({selectedCells.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
            <h2 className="text-lg font-bold p-4 border-b text-center">Select Date</h2>
            <div className="p-4 flex-1 overflow-y-auto">
              {/* Year */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Year</h3>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 20 }, (_, i) => 2020 + i).map(y => (
                    <button
                      key={y}
                      onClick={() => setTempDate({ ...tempDate, year: y, day: 1 })}
                      className={`p-2 rounded ${tempDate.year === y ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Month</h3>
                <div className="grid grid-cols-3 gap-2">
                  {months.map((m, i) => (
                    <button
                      key={m}
                      onClick={() => setTempDate({ ...tempDate, month: i, day: 1 })}
                      className={`p-2 rounded ${tempDate.month === i ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day */}
              <div>
                <h3 className="font-medium mb-2">Day</h3>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: getDaysInMonth(tempDate.month, tempDate.year) }, (_, i) => i + 1).map(d => (
                    <button
                      key={d}
                      onClick={() => setTempDate({ ...tempDate, day: d })}
                      className={`p-2 rounded ${tempDate.day === d ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <button onClick={selectDateDone} className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto p-4" ref={tableRef}>
        <table className="border-collapse border border-gray-300 bg-white min-w-full">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="border px-4 py-3 sticky left-0 z-20 bg-red-600 min-w-[160px]">IGS Team</th>
              {weekDates.map((d, i) => {
                const isToday = d.day === today.getDate() && d.month === today.getMonth() && d.year === today.getFullYear();
                const isSelected = d.day === selectedDate.day && d.month === selectedDate.month && d.year === selectedDate.year;
                const weekend = isWeekend(d.day, d.month, d.year);
                return (
                  <th
                    key={i}
                    className={`border px-4 py-3 text-center min-w-[110px] ${
                      isSelected ? "bg-yellow-300 text-black" :
                      isToday ? "bg-gray-300 text-black" :
                      weekend ? "bg-red-200 text-red-900" : ""
                    }`}
                  >
                    <div className="font-bold">{getWeekday(d.day, d.month, d.year)}</div>
                    <div>{d.day} {months[d.month].slice(0, 3)}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {employeeNames.map((name, empIndex) => (
              <tr key={empIndex}>
                <td className="border px-4 py-3 font-semibold sticky left-0 bg-white z-10 min-w-[160px]">
                  {name}
                </td>
                {weekDates.map((_, dayIndex) => {
                  const cell = schedule[dayIndex]?.[empIndex] || { status: "off", start: "", end: "" };
                  const isSelected = selectedCells.some(c => c.day === dayIndex && c.emp === empIndex);
                  const isEdited = editedCells.some(c => c.day === dayIndex && c.emp === empIndex);
                  const isToday = weekDates[dayIndex].day === today.getDate() &&
                                  weekDates[dayIndex].month === today.getMonth() &&
                                  weekDates[dayIndex].year === today.getFullYear();
                  const weekend = isWeekend(weekDates[dayIndex].day, weekDates[dayIndex].month, weekDates[dayIndex].year);

                  return (
                    <td
                      key={dayIndex}
                      onClick={() => toggleSelectCell(dayIndex, empIndex)}
                      className={`border px-4 py-3 text-center cursor-pointer min-w-[110px] ${
                        isSelected ? "bg-blue-600 text-white font-medium" :
                        isEdited ? "bg-yellow-200" :
                        isToday ? "bg-gray-200" :
                        (cell.status === "off" || weekend) ? "bg-red-50 text-red-800" :
                        "bg-green-50 text-green-800"
                      }`}
                    >
                      {cell.status === "off" ? "Day Off" : `${cell.start}-${cell.end}`}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-center">Edit Shift</h2>
            <div className="space-y-3 mb-6">
              {shifts.map(s => (
                <button
                  key={s.label}
                  onClick={() => setTempShift({ ...s, status: "work" })}
                  className={`w-full p-3 rounded ${
                    tempShift.start === s.start && tempShift.status === "work" ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <button
              onClick={toggleDayOff}
              className={`w-full p-3 rounded mb-6 ${
                tempShift.status === "off" ? "bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {tempShift.status === "off" ? "✓ Day Off" : "Set Day Off"}
            </button>
            <div className="flex gap-3">
              <button onClick={applyShift} className="flex-1 bg-red-500 text-white p-3 rounded hover:bg-red-600">
                Apply
              </button>
              <button onClick={() => setEditing(false)} className="flex-1 bg-gray-300 p-3 rounded hover:bg-gray-400">
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