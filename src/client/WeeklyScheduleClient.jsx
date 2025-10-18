import React, { useState, useRef, useEffect } from "react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const employeeNames = [
  "LEONG IN LAI",
  "KHA MAKARA","SIVAKUMAR","NGOUN PHANNY",
  "SUONG SOVOTANAK", "HENG MENGLY", "POR KIMHUCHOR", "ORN TAK", 
  "SOTH SOKLAY","PHOEUN SOPHANY", "HENG THIRITH"
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
      weekday: d.getDay()
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
        status: isWeekendDay ? "off" : "work"
      }));
    });
  };

  const [schedule, setSchedule] = useState(initializeSchedule);
  const weekDates = getWeekDatesFromMonday(currentMonday);

  useEffect(() => {
    setSchedule(initializeSchedule());
  }, [currentMonday]);

  useEffect(() => {
    if (!firstLoad) return;
    const todayIndex = weekDates.findIndex(
      d => d.day === today.getDate() &&
           d.month === today.getMonth() &&
           d.year === today.getFullYear()
    );
    if (todayIndex !== -1 && headerRefs.current[todayIndex]) {
      headerRefs.current[todayIndex].scrollIntoView({ 
        behavior: "smooth", 
        inline: "center",
        block: "nearest"
      });
    }
    setFirstLoad(false);
  }, [weekDates, firstLoad]);

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
    setFirstLoad(true);
  };

  const getWeekRangeDisplay = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    if (start.month === end.month) {
      return `${months[start.month]} ${start.day}-${end.day}, ${end.year}`;
    }
    return `${months[start.month]} ${start.day} - ${months[end.month]} ${end.day}, ${end.year}`;
  };

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
          <h1 className="text-sm md:text-xl font-bold text-red-500 mx-2 text-center flex-1">
            {getWeekRangeDisplay()}
          </h1>
          <div className="w-12 md:w-16"></div>
        </div>
        
        <div className="flex gap-2 justify-center mt-2">
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
                    className={`border border-gray-300 px-2 py-2 md:px-3 md:py-2 text-center text-xs md:text-sm min-w-[80px] md:min-w-[100px] ${
                      isToday ? "bg-gray-300 text-black" : ""
                    } ${isWeekendDay && !isToday ? "bg-red-200 text-red-900" : ""}`}
                  >
                    <div>{weekday}</div>
                    <div>{date.day} {monthShort}</div>
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
                {weekDates.map((date, dayIndex) => {
                  const cell = schedule[dayIndex]?.[empIndex] || {
                    start: "08:00",
                    end: "17:36",
                    status: "work"
                  };
                  const isWeekendDay = isWeekend(date.weekday);
                  const isToday = date.day === today.getDate() &&
                                  date.month === today.getMonth() &&
                                  date.year === today.getFullYear();
                  const text = cell.status === "off" ? "Day Off" : `${cell.start}-${cell.end}`;
                  
                  return (
                    <td
                      key={dayIndex}
                      className={`border border-gray-300 px-2 py-2 md:px-3 md:py-2 text-center text-xs md:text-sm ${
                        isToday ? "bg-gray-200" : ""
                      } ${
                        !isToday && (cell.status === "off" || isWeekendDay)
                          ? "bg-red-50 text-red-800"
                          : ""
                      } ${
                        !isToday && cell.status !== "off" && !isWeekendDay
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
    </div>
  );
};

export default WeeklyScheduleClient;