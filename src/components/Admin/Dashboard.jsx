import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const Dashboard = ({ setCurrentView }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM AM/PM
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
  };

  // Format date as Weekday, Month Day, Year
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Determine greeting based on current hour
  const getGreeting = (date) => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Sticky Header */}
      <div className="bg-gray-200 p-4 flex items-center sticky top-0 z-50 shadow-md">
        <button
          onClick={() => setCurrentView("login")}
          className="mr-3 text-red-500"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-red-500 flex-1 text-center">
          Welcome to IGS Team
        </h1>
      </div>

      {/* Content */}
      <div className="p-6 max-w-md mx-auto space-y-4 overflow-y-auto">
        {/* Dynamic Greeting */}
        <div className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold text-center shadow-md hover:bg-red-600 transition-colors">
          {getGreeting(currentTime)}
        </div>

        {/* Current Date */}
        <div className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold text-center shadow-md hover:bg-red-600 transition-colors">
          {formatDate(currentTime)}
        </div>

        {/* Current Time */}
        <div className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold text-center shadow-md hover:bg-red-600 transition-colors">
          {formatTime(currentTime)}
        </div>

        {/* Buttons */}
        <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transition-colors">
          Day Work
        </button>
        <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transition-colors">
          Check In : 8:00 AM
        </button>
        <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transition-colors">
          Check Out : 5:36 PM
        </button>

        {/* Navigation Buttons */}
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
      </div>
    </div>
  );
};

export default Dashboard;
