import React, { useState, useRef, useEffect } from "react";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const employeeNames = [
  "LEONG IN LAI","KHA MAKARA","SIVAKUMAR","NGOUN PHANNY","SUONG SOVOTANAK",
  "HENG MENGLY","POR KIMHUCHOR","ORN TAK","SOTH SOKLAY","PHOEUN SOPHANY","HENG THIRITH",
];

const getDaysInMonth = (month, year) => {
  const validMonth = month || 0;
  const validYear = year || new Date().getFullYear();
  return new Date(validYear, validMonth + 1, 0).getDate();
};

const getWeekDates = (startDate) => {
  const dates = [];
  const start = new Date(startDate);
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
    year: today.getFullYear(),
  });
  const [tempDate, setTempDate] = useState(selectedDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const weekDates = getWeekDates(currentWeekStart);

  // Default schedule (same as admin)
  const initializeSchedule = () => {
    return weekDates.map(({ day, month, year }) => {
      const weekend = isWeekend(day, month, year);
      return employeeNames.map(() => ({
        start: weekend ? "" : "08:00",
        end: weekend ? "" : "17:36",
        status: weekend ? "off" : "work",
      }));
    });
  };

  const [schedule, setSchedule] = useState(initializeSchedule);

  useEffect(() => {
    setSchedule(initializeSchedule());
  }, [currentWeekStart]);

  const prevWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newStart);
    const newWeekDates = getWeekDates(newStart);
    setSelectedDate({
      day: newWeekDates[0].day,
      month: newWeekDates[0].month,
      year: newWeekDates[0].year,
    });
  };

  const nextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newStart);
    const newWeekDates = getWeekDates(newStart);
    setSelectedDate({
      day: newWeekDates[0].day,
      month: newWeekDates[0].month,
      year: newWeekDates[0].year,
    });
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
    const maxDays = getDaysInMonth(tempDate.month, tempDate.year);
    const validDay = Math.min(tempDate.day || 1, maxDays);
    const newDate = {
      day: validDay,
      month: tempDate.month || 0,
      year: tempDate.year || today.getFullYear(),
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
      (d) =>
        d.day === selectedDate.day &&
        d.month === selectedDate.month &&
        d.year === selectedDate.year
    );
    const headerIndex = selectedDayIndex + 1;
    if (ths[headerIndex] && selectedDayIndex >= 0) {
      ths[headerIndex].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedDate, weekDates]);

  const tempMonthForDays =
    tempDate.month !== undefined ? tempDate.month : today.getMonth();
  const tempYearForDays =
    tempDate.year !== undefined ? tempDate.year : today.getFullYear();
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
            Back
          </button>
          <h1 className="text-base md:text-xl font-bold text-red-500 mx-2 text-center flex-1">
            Week of {months[weekDates[0].month]} {weekDates[0].day},{" "}
            {weekDates[0].year}
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
        </div>
      </div>

      {/* Date Picker */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
            <h2 className="text-lg font-semibold text-center p-4 border-b">
              Select Date
            </h2>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Year */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2 text-gray-700">Year</h3>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 20 }, (_, i) => 2015 + i).map((year) => (
                    <button
                      key={year}
                      onClick={() => setTempDate({ ...tempDate, year, day: 1 })}
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

              {/* Month */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2 text-gray-700">
                  Month
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {months.map((m, idx) => (
                    <button
                      key={m}
                      onClick={() =>
                        setTempDate({ ...tempDate, month: idx, day: 1 })
                      }
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

              {/* Day */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700">Day</h3>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: daysInTempMonth }, (_, i) => i + 1).map(
                    (day) => (
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
                    )
                  )}
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

      {/* Schedule Table (read-only) */}
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
                const isToday =
                  day === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear();
                const isWeekendDay = isWeekend(day, month, year);
                const isSelected =
                  day === selectedDate.day &&
                  month === selectedDate.month &&
                  year === selectedDate.year;

                return (
                  <th
                    key={i}
                    className={`border border-gray-300 px-2 py-2 md:px-3 md:py-2 text-center text-xs md:text-sm min-w-[80px] md:min-w-[100px] ${
                      isSelected ? "bg-yellow-400 text-black" : ""
                    } ${
                      isToday && !isSelected ? "bg-gray-300 text-black" : ""
                    } ${
                      isWeekendDay && !isSelected && !isToday
                        ? "bg-red-200 text-red-900"
                        : ""
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
                    status: "work",
                  };
                  const weekend = isWeekend(day, month, year);
                  const isToday =
                    day === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear();

                  const text =
                    cell.status === "off" ? "Day Off" : `${cell.start}-${cell.end}`;

                  return (
                    <td
                      key={dayIndex}
                      className={`border border-gray-300 px-2 py-2 md:px-3 md:py-2 text-center text-xs md:text-sm ${
                        weekend ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
                      } ${isToday ? "bg-gray-200" : ""}`}
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
