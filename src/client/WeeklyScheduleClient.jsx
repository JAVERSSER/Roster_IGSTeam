import React, { useState, useRef, useEffect } from "react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const employeeNames = [
  "LEONG IN LAI",
  "KHA MAKARA", "SIVAKUMAR", "NGOUN PHANNY",
  "SUONG SOVOTANAK", "HENG MENGLY", "POR KIMHUCHOR",
  "ORN TAK", "SOTH SOKLAY", "PHOEUN SOPHANY", "HENG THIRITH"
];

const getDaysInMonth = (month, year) =>
  new Date(year, month + 1, 0).getDate();

const getWeekDates = (startDate) => {
  const dates = [];
  const start = new Date(startDate);
  start.setDate(start.getDate() - (start.getDay() || 7) + 1); // Monday
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push({
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear()
    });
  }
  return dates;
};

const getWeekday = (day, month, year) =>
  new Date(year, month, day).toLocaleDateString("en-US", { weekday: "short" });

const isWeekend = (day, month, year) => {
  const weekday = new Date(year, month, day).getDay();
  return weekday === 0 || weekday === 6;
};

const WeeklyScheduleClient = ({ setCurrentView }) => {
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

  const weekDates = getWeekDates(currentWeekStart);

  // Initialize default schedule (read-only)
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

  // Update week view when changing weeks
  useEffect(() => {
    setSchedule(initializeSchedule());
  }, [currentWeekStart]);

  const prevWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newStart);
    const newWeekDates = getWeekDates(newStart);
    setSelectedDate(newWeekDates[0]);
  };

  const nextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newStart);
    const newWeekDates = getWeekDates(newStart);
    setSelectedDate(newWeekDates[0]);
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

  // Auto-scroll to selected day
  useEffect(() => {
    if (!tableRef.current) return;
    const ths = tableRef.current.querySelectorAll("thead th");
    const selectedDayIndex = weekDates.findIndex(
      d => d.day === selectedDate.day && d.month === selectedDate.month && d.year === selectedDate.year
    );
    const headerIndex = selectedDayIndex + 1;
    if (ths[headerIndex] && selectedDayIndex >= 0) {
      ths[headerIndex].scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [selectedDate, weekDates]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-gray-200 p-3 md:p-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView("dashboard")}
            className="text-red-500 font-medium text-sm md:text-base"
          >
            Back
          </button>
          <h1 className="text-base md:text-xl font-bold text-red-500 text-center flex-1">
            Week of {months[weekDates[0].month]} {weekDates[0].day}, {weekDates[0].year}
          </h1>
          <div className="w-12 md:w-16"></div>
        </div>

        <div className="flex gap-2 justify-center mt-2 flex-wrap">
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
        </div>
      </div>

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
                  const cell = schedule[dayIndex]?.[empIndex] || {
                    start: "08:00",
                    end: "17:36",
                    status: "work"
                  };
                  const isWeekendDay = isWeekend(day, month, year);
                  const text = cell.status === "off" ? "Day Off" : `${cell.start}-${cell.end}`;
                  const isToday = day === today.getDate() &&
                                  month === today.getMonth() &&
                                  year === today.getFullYear();
                  const isColumnSelected = day === selectedDate.day &&
                                           month === selectedDate.month &&
                                           year === selectedDate.year;
                  return (
                    <td
                      key={dayIndex}
                      className={`border border-gray-300 px-2 py-2 md:px-3 md:py-2 text-center text-xs md:text-sm ${
                        isColumnSelected ? "bg-yellow-100" : ""
                      } ${isToday && !isColumnSelected ? "bg-gray-200" : ""} ${
                        isWeekendDay ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
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
    </div>
  );
};

export default WeeklyScheduleClient;
