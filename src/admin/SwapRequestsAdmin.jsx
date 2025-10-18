import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

const employees = [
  "SUONG SOVOTANAK",
  "HENG MENGLY",
  "POR KIMHUCHOR",
  "ORN TAK",
  "SOTH SOKLAY",
  "PHOEUN SOPHANY",
  "HENG THIRITH",
];

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

const SwapRequestsAdmin = ({ setCurrentView }) => {
  const [swapList, setSwapList] = useState([]);
  const [newSwap, setNewSwap] = useState({
    employee1: "",
    employee2: "",
    date: "",
    remark: "",
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState({
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [deletingId, setDeletingId] = useState(null);

  // Load swaps from Firebase
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "swaps"),
      (snap) =>
        setSwapList(
          snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort(
              (a, b) =>
                (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
            )
        ),
      (err) => {
        console.error("Failed to load swaps:", err);
        setError("Failed to load swaps: " + (err.message || err));
      }
    );
    return () => unsub();
  }, []);

  // Add new swap
  const handleAddSwap = async () => {
    setError("");
    if (
      !newSwap.employee1 ||
      !newSwap.employee2 ||
      !newSwap.date ||
      !newSwap.remark
    ) {
      return setError("Please fill in all fields.");
    }
    if (newSwap.employee1 === newSwap.employee2) {
      return setError("Employees must be different.");
    }
    setIsSaving(true);
    try {
      const payload = { ...newSwap, createdAt: serverTimestamp() };
      await addDoc(collection(db, "swaps"), payload);
      setNewSwap({ employee1: "", employee2: "", date: "", remark: "" });
      alert("Swap added successfully");
      setCurrentView("dashboard");
    } catch (err) {
      console.error("Failed to add swap:", err);
      setError("Failed to add swap: " + (err.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  // Delete swap
  const handleDeleteSwap = async (e, swapId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this swap request?")) {
      return;
    }
    setDeletingId(swapId);
    try {
      await deleteDoc(doc(db, "swaps", swapId));
      alert("Swap deleted successfully");
    } catch (err) {
      console.error("Failed to delete swap:", err);
      alert("Failed to delete swap: " + (err.message || err));
    } finally {
      setDeletingId(null);
    }
  };

  // Handle Enter key press in remark field
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && isFormValid && !isSaving) {
      handleAddSwap();
    }
  };

  // Check if form is valid
  const isFormValid =
    newSwap.employee1 &&
    newSwap.employee2 &&
    newSwap.date &&
    newSwap.remark &&
    newSwap.employee1 !== newSwap.employee2;

  // Format timestamp
  const formatTimestamp = (ts) => {
    if (!ts?.seconds) return "-";
    const date = new Date(ts.seconds * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Format selected date for display
  const formatSelectedDate = (dateString) => {
    if (!dateString) return "Select Date";
    const date = new Date(dateString);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Handle date selection
  const handleDateSelect = () => {
    const selectedDate = new Date(tempDate.year, tempDate.month, tempDate.day);
    setNewSwap({ ...newSwap, date: selectedDate.toISOString().split("T")[0] });
    setShowDatePicker(false);
  };

  // Get days in month
  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();

  // Get weekday
  const getWeekday = (day, month, year) =>
    new Date(year, month, day).toLocaleDateString("en-US", {
      weekday: "short",
    });

  // Check if date is weekend
  const isWeekend = (day, month, year) => {
    const weekday = new Date(year, month, day).getDay();
    return weekday === 0 || weekday === 6;
  };

  // Check if date is today
  const isToday = (day, month, year) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-gray-200 p-4 flex items-center sticky top-0 z-50">
        <button
          onClick={() => setCurrentView("dashboard")}
          className="mr-3 text-red-500"
        >
          Back
        </button>
        <h1 className="text-xl font-bold text-red-500 flex-1 text-center">
          IGS Swap (Admin)
        </h1>
      </div>

      <div className="p-4">
        {/* Add Swap Form */}
        <div className="mb-4 space-y-3 bg-white p-4 rounded-lg shadow">
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={newSwap.employee1}
            onChange={(e) =>
              setNewSwap({ ...newSwap, employee1: e.target.value })
            }
          >
            <option value="">Select Your Name</option>
            {employees.map((emp, idx) => (
              <option key={idx} value={emp}>
                {emp}
              </option>
            ))}
          </select>

          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={newSwap.employee2}
            onChange={(e) =>
              setNewSwap({ ...newSwap, employee2: e.target.value })
            }
          >
            <option value="">Select Team you want to replace</option>
            {employees.map((emp, idx) => (
              <option key={idx} value={emp}>
                {emp}
              </option>
            ))}
          </select>

          {/* Enhanced Date Picker */}
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(true)}
              className={`w-full p-3 border rounded-lg text-left flex justify-between items-center ${
                newSwap.date
                  ? "border-green-500 bg-green-50 text-green-800"
                  : "border-gray-300 bg-white"
              } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
            >
              <span>{formatSelectedDate(newSwap.date)}</span>
              <span className="text-gray-500">📅</span>
            </button>
          </div>

          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Remark / Reason"
            value={newSwap.remark}
            onChange={(e) => setNewSwap({ ...newSwap, remark: e.target.value })}
            onKeyPress={handleKeyPress}
          />

          <button
            className={`w-full p-3 rounded-lg font-semibold transition ${
              !isFormValid || isSaving
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600 transform hover:scale-105"
            }`}
            onClick={handleAddSwap}
            disabled={!isFormValid || isSaving}
          >
            {isSaving ? "Saving..." : "Add Swap Request"}
          </button>

          {error && (
            <div className="text-sm text-red-600 mt-2 p-2 bg-red-50 rounded border border-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Date Picker Modal - Fixed for Mobile */}
        {showDatePicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col">
              {/* Header with Close Button */}
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-lg font-semibold">Select Date</h2>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Year Selection */}
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 text-center">Year</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Array.from(
                      { length: 5 },
                      (_, i) => new Date().getFullYear() + i
                    ).map((year) => (
                      <button
                        key={year}
                        onClick={() => setTempDate({ ...tempDate, year })}
                        className={`px-3 py-2 rounded text-sm min-w-[60px] ${
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
                  <h3 className="font-semibold mb-2 text-center">Month</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {months.map((month, idx) => (
                      <button
                        key={month}
                        onClick={() => setTempDate({ ...tempDate, month: idx })}
                        className={`p-2 rounded text-sm ${
                          tempDate.month === idx
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Day Selection */}
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 text-center">
                    {months[tempDate.month]} {tempDate.year}
                  </h3>
                  <div className="grid grid-cols-7 gap-1 text-xs">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center font-semibold text-gray-600 p-1"
                        >
                          {day}
                        </div>
                      )
                    )}
                    {Array.from(
                      { length: getDaysInMonth(tempDate.month, tempDate.year) },
                      (_, i) => {
                        const day = i + 1;
                        const isWeekendDay = isWeekend(
                          day,
                          tempDate.month,
                          tempDate.year
                        );
                        const isTodayDate = isToday(
                          day,
                          tempDate.month,
                          tempDate.year
                        );

                        return (
                          <button
                            key={day}
                            onClick={() => setTempDate({ ...tempDate, day })}
                            className={`p-2 rounded text-sm min-h-[40px] flex items-center justify-center ${
                              tempDate.day === day
                                ? "bg-red-500 text-white"
                                : isTodayDate
                                ? "bg-orange-100 text-orange-800 border border-orange-300"
                                : isWeekend(day, tempDate.month, tempDate.year)
                                ? "bg-gray-100 hover:bg-gray-200"
                                : "bg-gray-100 hover:bg-gray-200"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>

              {/* Footer with Action Buttons - Fixed at bottom */}
              <div className="p-4 border-t bg-gray-50 sticky bottom-0">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDateSelect}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                  >
                    Select Date
                  </button>
                </div>
                {newSwap.date && (
                  <div className="mt-2 text-center text-sm text-green-600 font-medium">
                    Selected: {formatSelectedDate(newSwap.date)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Swap List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Swap Requests
          </h2>
          {swapList.length === 0 ? (
            <div className="text-center text-gray-500 py-8 bg-white rounded-lg">
              No swap requests yet
            </div>
          ) : (
            swapList.map((swap) => (
              <div
                key={swap.id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md hover:border-red-300 transition"
              >
                <div className="flex justify-between items-start gap-3">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() =>
                      alert(`
${swap.employee1} ↔ ${swap.employee2}
Date: ${swap.date}
Remark: ${swap.remark}
Submitted: ${formatTimestamp(swap.createdAt)}
                    `)
                    }
                  >
                    <div className="font-semibold text-red-600">
                      {swap.employee1} ↔ {swap.employee2}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Date: <span className="font-medium">{swap.date}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Reason: <span className="font-medium">{swap.remark}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {formatTimestamp(swap.createdAt)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSwap(e, swap.id)}
                    disabled={deletingId === swap.id}
                    className={`px-4 py-2 rounded-lg font-semibold transition shrink-0 ${
                      deletingId === swap.id
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600 active:scale-95"
                    }`}
                  >
                    {deletingId === swap.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapRequestsAdmin;
