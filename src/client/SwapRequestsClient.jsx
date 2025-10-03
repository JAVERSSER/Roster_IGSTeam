import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const SwapRequestsClient = ({ setCurrentView }) => {
  const [swapList, setSwapList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "swaps"),
      (snap) => {
        setSwapList(
          snap.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .sort(
              (a, b) =>
                (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
            )
        );
      },
      (err) => {
        console.error("Failed to load swaps:", err);
        setError("Failed to load swaps: " + (err.message || err));
      }
    );

    return () => unsub();
  }, []);

  const formatTimestamp = (ts) => {
    if (!ts?.seconds) return "-";
    const date = new Date(ts.seconds * 1000);
    return date.toLocaleString();
  };

  const handleClick = (swap) => {
    const createdAtStr = formatTimestamp(swap.createdAt);
    const dateStr = swap.date || "-";
    alert(`
Swap: ${swap.employee1} ↔ ${swap.employee2}
Date: ${dateStr}
Remark: ${swap.remark || "-"}
Submitted at: ${createdAtStr}
    `);
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
        <h1 className="text-xl font-bold text-red-500 flex-1 text-center ">
          IGS Swap Day
        </h1>
      </div>

      {/* Swap List */}
      <div className="p-4 overflow-y-auto max-h-[calc(100vh-64px)] space-y-3">
        {error && <div className="text-red-600 text-center">{error}</div>}
        {swapList.length === 0 && (
          <div className="text-gray-500 text-center">Please Wait</div>
        )}
        {swapList.map((swap) => (
          <div
            key={swap.id}
            onClick={() => handleClick(swap)}
            className="bg-red-500 text-white p-4 rounded-lg cursor-pointer hover:bg-red-600 transition"
          >
            {swap.employee1} ↔ {swap.employee2} ({swap.date || "-"}) -{" "}
            {formatTimestamp(swap.createdAt)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwapRequestsClient;
