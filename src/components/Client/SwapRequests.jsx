import React from "react";
import { ArrowLeft } from "lucide-react";

const SwapRequests = ({ setCurrentView }) => {
  const swapList = [
    { id: 1, text: "Mr. Rith swap Mr. Phany on Monday 29th 2025", detail: "Reason: Busy at home" },
    { id: 2, text: "Mr. Rith Off on Wednesday, pay Saturday", detail: "Reason: Personal" },
    { id: 3, text: "Mr. Phany off for exam in India", detail: "Reason: Final Exam" },
    { id: 4, text: "Mr. Vatanak off", detail: "Reason: Busy at home" },
    { id: 5, text: "Mr. Rith Sokly off", detail: "Reason: Family party" },
    { id: 7, text: "Mr. Rith off", detail: "Reason: Go to Siem Reap" },
    { id: 8, text: "Mr. Rith off", detail: "Reason: Go to Siem Reap" },
    { id: 9, text: "Mr. Rith off", detail: "Reason: Go to Siem Reap" },
    { id: 10, text: "Mr. Rith off", detail: "Reason: Go to Siem Reap" },
    { id: 11, text: "Mr. Rith off", detail: "Reason: Go to Siem Reap" },
    { id: 12, text: "Mr. Rith off", detail: "Reason: Go to Siem Reap" },
    { id: 13, text: "Mr. Rith off", detail: "Reason: Go to Siem Reap" },
    // Add more items if needed
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky Header */}
      <div className="bg-gray-200 p-4 flex items-center sticky top-0 z-50">
        <button
          onClick={() => setCurrentView("dashboard")}
          className="mr-3 text-red-500"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-red-500 flex-1 text-center">
          IGS Swap
        </h1>
      </div>

      {/* Swap List */}
      <div className="p-4 overflow-y-auto max-h-[calc(100vh-64px)] space-y-3">
        {swapList.map((swap) => (
          <div
            key={swap.id}
            onClick={() => alert(`${swap.text}\n\n${swap.detail}`)}
            className="bg-red-500 text-white p-4 rounded-lg cursor-pointer hover:bg-red-600 transition"
          >
            {swap.id}. {swap.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwapRequests;
