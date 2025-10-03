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

const App = () => {
  const [role, setRole] = useState(null); // 'admin' | 'client' | null
  const [currentView, setCurrentView] = useState("login");
  const [userCredentials, setUserCredentials] = useState({ userId: "", password: "" });
  const [selectedDate, setSelectedDate] = useState({ day: 1, month: 0, year: 2025 });
  const [mounted, setMounted] = useState(false);
  const [hoveredRole, setHoveredRole] = useState(null);

  // Firebase auth + role check
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { getAuth, onAuthStateChanged } = await import("firebase/auth");
        const { doc, getDoc } = await import("firebase/firestore");
        const { app, db } = await import("./firebase");
        const auth = getAuth(app);
        onAuthStateChanged(auth, async (user) => {
          if (!user) return;
          try {
            const udoc = await getDoc(doc(db, "users", user.uid));
            if (udoc.exists() && udoc.data().role === "admin") {
              setRole("admin");
              setCurrentView("dashboard");
            } else {
              setRole("client");
              setCurrentView("dashboard");
            }
          } catch (err) {
            console.error("Failed to fetch user role:", err);
          }
        });
      } catch (err) {
        console.error("Auth init failed", err);
      }
    };
    initAuth();

    // Local session
    try {
      const raw = localStorage.getItem("igs_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.role) {
          setRole(parsed.role);
          setCurrentView("dashboard");
        }
      }
    } catch (e) {
      // ignore
    }

    // Mount animation
    setMounted(true);
  }, []);

  const onLogout = () => {
    try {
      localStorage.removeItem("igs_user");
    } catch (e) {}
    (async () => {
      try {
        const { getAuth, signOut } = await import("firebase/auth");
        const { app } = await import("./firebase");
        const auth = getAuth(app);
        await signOut(auth);
      } catch (e) {}
    })();
    setRole(null);
    setCurrentView("login");
    setUserCredentials({ userId: "", password: "" });
  };

  // Role selection screen
  if (!role) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-red-500 to-orange-500 animate-gradient-shift"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* Main content */}
        <div className="relative z-10 max-w-md w-full space-y-8">
          <div
            className={`text-center transition-all duration-1000 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
            }`}
          >
            <div className="inline-block mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white blur-2xl opacity-50 animate-pulse-slow"></div>
                <h1 className="relative text-6xl font-black bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                  IGS
                </h1>
              </div>
            </div>
            <p className="text-white text-xl font-semibold tracking-wider animate-fade-in-delay">
              Select Your Role
            </p>
          </div>

          {/* Role cards */}
          <div
            className={`space-y-4 transition-all duration-1000 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {/* Admin Card */}
            <div
              onMouseEnter={() => setHoveredRole("admin")}
              onMouseLeave={() => setHoveredRole(null)}
              onClick={() => {
                setRole("admin");
                setCurrentView("login");
              }}
              className="group relative cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative backdrop-blur-xl bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 shadow-2xl border border-red-400/30 transform group-hover:scale-105 group-hover:shadow-red-500/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors duration-300">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Admin</h2>
                      <p className="text-red-100 text-sm">Full System Access</p>
                    </div>
                  </div>
                  <svg
                    className={`w-8 h-8 text-white transition-transform duration-300 ${
                      hoveredRole === "admin" ? "translate-x-2" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* IGS Team Card */}
            <div
              onMouseEnter={() => setHoveredRole("client")}
              onMouseLeave={() => setHoveredRole(null)}
              onClick={() => {
                setRole("client");
                setCurrentView("login");
              }}
              className="group relative cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative backdrop-blur-xl bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl p-6 shadow-2xl border border-gray-400/30 transform group-hover:scale-105 group-hover:shadow-gray-500/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors duration-300">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">IGS Team</h2>
                      <p className="text-gray-200 text-sm">Team Member Access</p>
                    </div>
                  </div>
                  <svg
                    className={`w-8 h-8 text-white transition-transform duration-300 ${
                      hoveredRole === "client" ? "translate-x-2" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <p
            className={`text-center text-white/80 text-sm transition-all duration-1000 delay-500 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            Choose your role to continue
          </p>
        </div>

        {/* Animations */}
        <style jsx>{`
          @keyframes gradient-shift {
            0%,
            100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          @keyframes blob {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          @keyframes pulse-slow {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
          @keyframes fade-in-delay {
            0% {
              opacity: 0;
              transform: translateY(-10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-gradient-shift {
            background-size: 200% 200%;
            animation: gradient-shift 15s ease infinite;
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          .animate-pulse-slow {
            animation: pulse-slow 3s ease-in-out infinite;
          }
          .animate-fade-in-delay {
            animation: fade-in-delay 1s ease-out 0.5s both;
          }
        `}</style>
      </div>
    );
  }

  // Admin views
  if (role === "admin") {
    switch (currentView) {
      case "login":
        return (
          <FormLoginAdmin
            userCredentials={userCredentials}
            setUserCredentials={setUserCredentials}
            onLogin={() => setCurrentView("dashboard")}
          />
        );
      case "dashboard":
        return <DashboardAdmin setCurrentView={setCurrentView} onLogout={onLogout} />;
      case "swap":
        return <SwapRequestsAdmin setCurrentView={setCurrentView} />;
      case "weekly":
        return <WeeklyScheduleAdmin setCurrentView={setCurrentView} />;
      case "monthly":
        return (
          <MonthlyScheduleAdmin
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setCurrentView={setCurrentView}
          />
        );
      default:
        return (
          <FormLoginAdmin
            userCredentials={userCredentials}
            setUserCredentials={setUserCredentials}
            onLogin={() => setCurrentView("dashboard")}
          />
        );
    }
  }

  // Client views
  if (role === "client") {
    switch (currentView) {
      case "login":
        return (
          <FormLoginClient
            userCredentials={userCredentials}
            setUserCredentials={setUserCredentials}
            onLogin={() => setCurrentView("dashboard")}
          />
        );
      case "dashboard":
        return <DashboardClient setCurrentView={setCurrentView} onLogout={onLogout} />;
      case "swap":
        return <SwapRequestsClient setCurrentView={setCurrentView} />;
      case "weekly":
        return <WeeklyScheduleClient setCurrentView={setCurrentView} />;
      case "monthly":
        return (
          <MonthlyScheduleClient
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setCurrentView={setCurrentView}
          />
        );
      default:
        return (
          <FormLoginClient
            userCredentials={userCredentials}
            setUserCredentials={setUserCredentials}
            onLogin={() => setCurrentView("dashboard")}
          />
        );
    }
  }

  return null;
};

export default App;
