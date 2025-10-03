import React, { useState, useEffect } from "react";
import FormLoginAdmin from "./admin/FormLoginAdmin";
import DashboardAdmin from "./admin/DashboardAdmin";
import WeeklyScheduleAdmin from "./admin/WeeklyScheduleAdmin";
import MonthlyScheduleAdmin from "./admin/MonthlyScheduleAdmin";
import SwapRequestsAdmin from "./admin/SwapRequestsAdmin";
import FormLoginClient from "./client/FormLoginClient";
import DashboardClient from "./client/DashboardClient";
import WeeklyScheduleClient from "./client/WeeklyScheduleClient";
import MonthlyScheduleClient from "./client/MonthlyScheduleClient";
import SwapRequestsClient from "./client/SwapRequestsClient";



const IGSApp = () => {
  const [role, setRole] = useState(null); // 'admin' | 'client' | null
  const [currentView, setCurrentView] = useState("login");
  const [userCredentials, setUserCredentials] = useState({ userId: "", password: "" });
  const [selectedDate, setSelectedDate] = useState({ day: 1, month: 0, year: 2025 });

  // Firebase auth + role check
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { getAuth, onAuthStateChanged } = await import('firebase/auth');
        const { doc, getDoc } = await import('firebase/firestore');
        const { app, db } = await import('./firebase');
        const auth = getAuth(app);
        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            // no auth -> keep role as previously selected or null
            return;
          }
          try {
            const udoc = await getDoc(doc(db, 'users', user.uid));
            if (udoc.exists() && udoc.data().role === 'admin') {
              setRole('admin');
              setCurrentView('dashboard');
            } else {
              setRole('client');
              setCurrentView('dashboard');
            }
          } catch (err) {
            console.error('Failed to fetch user role:', err);
          }
        });
      } catch (err) {
        console.error('Auth init failed', err);
      }
    };
    initAuth();
    // pick up simple local username session (if user logged in with plain username)
    try {
      const raw = localStorage.getItem('igs_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.role) {
          setRole(parsed.role);
          setCurrentView('dashboard');
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);
  const onLogout = () => {
    // clear local username-session
    try { localStorage.removeItem('igs_user'); } catch (e) { }
    // try signing out firebase auth if present
    (async () => {
      try {
        const { getAuth, signOut } = await import('firebase/auth');
        const { app } = await import('./firebase');
        const auth = getAuth(app);
        await signOut(auth);
      } catch (e) {
        // ignore if auth not initialized
      }
    })();
    setRole(null);
    setCurrentView("login");
    setUserCredentials({ userId: "", password: "" });
  };

  // role selection screen
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <h1 className="text-center text-4xl font-bold text-red-500">IGS Role</h1>
          <div className="flex space-x-4">
            <button onClick={() => { setRole("admin"); setCurrentView("login"); }} className="flex-1 bg-red-500 text-white py-3 rounded-lg">Admin</button>
            <button onClick={() => { setRole("client"); setCurrentView("login"); }} className="flex-1 bg-gray-200 text-black py-3 rounded-lg">IGS Team</button>
          </div>
          <div className="mt-4 text-center">
            {/* Seed UI removed per user request */}
          </div>
        </div>
      </div>
    );
  }

  // Admin views
  if (role === "admin") {
    switch (currentView) {
      case "login":
        return <FormLoginAdmin userCredentials={userCredentials} setUserCredentials={setUserCredentials} onLogin={() => setCurrentView("dashboard")} />;
      case "dashboard":
        return <DashboardAdmin setCurrentView={setCurrentView} onLogout={onLogout} />;
      case "swap":
        return <SwapRequestsAdmin setCurrentView={setCurrentView} />;
      case "weekly":
        return <WeeklyScheduleAdmin setCurrentView={setCurrentView} />;
      case "monthly":
        return <MonthlyScheduleAdmin selectedDate={selectedDate} setSelectedDate={setSelectedDate} setCurrentView={setCurrentView} />;
      default:
        return <FormLoginAdmin userCredentials={userCredentials} setUserCredentials={setUserCredentials} onLogin={() => setCurrentView("dashboard")} />;
    }
  }

  // Client views (read-only)
  if (role === "client") {
    switch (currentView) {
      case "login":
        return <FormLoginClient userCredentials={userCredentials} setUserCredentials={setUserCredentials} onLogin={() => setCurrentView("dashboard")} />;
      case "dashboard":
        return <DashboardClient setCurrentView={setCurrentView} onLogout={onLogout} />;
      case "swap":
        return <SwapRequestsClient setCurrentView={setCurrentView} />;
      case "weekly":
        return <WeeklyScheduleClient setCurrentView={setCurrentView} />;
      case "monthly":
        return <MonthlyScheduleClient selectedDate={selectedDate} setSelectedDate={setSelectedDate} setCurrentView={setCurrentView} />;
      default:
        return <FormLoginClient userCredentials={userCredentials} setUserCredentials={setUserCredentials} onLogin={() => setCurrentView("dashboard")} />;
    }
  }

  return null;
};

export default IGSApp;
