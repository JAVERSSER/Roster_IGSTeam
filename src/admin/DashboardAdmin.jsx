import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const DashboardAdmin = ({ setCurrentView, onLogout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGreeting = (date) => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="bg-gray-200 p-4 flex items-center sticky top-0 z-50 shadow-md">
        <button onClick={onLogout} className="mr-3 text-red-500">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-red-500 flex-1 text-center">
          Admin Dashboard
        </h1>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-4 overflow-y-auto">
        {/* <div className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold text-center shadow-md hover:bg-red-600 transition-colors">
          {formatTime(currentTime)}
        </div> */}
        <div className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold text-center shadow-md hover:bg-red-600 transition-colors">
          {getGreeting(currentTime)}
        </div>
        <div className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold text-center shadow-md hover:bg-red-600 transition-colors">
          {formatDate(currentTime)}
        </div>
        <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transition-colors">
          Check In : 8:00 AM
        </button>
        <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transition-colors">
          Check Out : 5:36 PM
        </button>
        <div className="flex space-x-3 mt-4">
          <button
            onClick={() => setCurrentView("weekly")}
            className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transition-colors"
          >
            Week
          </button>
          <button
            onClick={() => setCurrentView("swap")}
            className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transition-colors"
          >
            Swap
          </button>
          <button
            onClick={() => setCurrentView("monthly")}
            className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transition-colors"
          >
            Months
          </button>
        </div>
        {/* new this line  */}
        <button
          onClick={() => {
            const link = document.createElement("a");
            link.href = "ProjectMangeCase.pdf"; // path inside public folder
            link.download = "ProjectMangeCase.pdf"; // file name to save
            link.click();
          }}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transition-colors"
        >
          download ProjectMangeCase.pdf
        </button>
        {/* stop  */}
      </div>
    </div>
  );
};

export default DashboardAdmin;
