import React, { useState, useRef, useEffect } from "react";

// ✅ Local hardcoded users
const localUsers = {
  "9643": "rith",
  "3079": "rith",
  "24706": "rith",
  "24747": "rith",
  "8755": "rith",
  "12286": "rith",
  "22574": "rith",
  "9763": "rith",
  "18982": "rith",
  "14639": "rith",
  "23856": "rith",
  "24689": "rith",
  "24936": "rith",
  "24942": "rith",
  "admin": "rith",
  "Admin": "rith",
  "rith": "rith",
};

// ✅ Allowed full names (case-insensitive + space-insensitive)
const allowedNames = [
  "LEONG IN LAI",
  "KHA MAKARA",
  "SIVAKUMAR",
  "NGOUN PHANNY",
  "SUONG SOVOTANAK",
  "HENG MENGLY",
  "POR KIMHUCHOR",
  "ORN TAK",
  "SOTH SOKLAY",
  "PHOEUN SOPHANY",
  "HENG THIRITH",
];


// Helper: normalize input
function normalize(str) {
  return str.replace(/\s+/g, "").toLowerCase();
}

const FormLoginClient = ({ userCredentials, setUserCredentials, onLogin }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const passwordRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async () => {
    setError("");
    const id = userCredentials.userId.trim();
    const pass = userCredentials.password.trim().toLowerCase();

    if (!id || !pass) {
      return setError("Enter username and password");
    }

    setIsLoading(true);
    try {
      const normalizedId = normalize(id);

      // 1️⃣ Check if input is a valid local ID
      const isValidId = localUsers.hasOwnProperty(id) && localUsers[id] === pass;

      // 2️⃣ Check if input matches allowed names (case-insensitive, no space)
      const isValidName =
        allowedNames.some((n) => normalize(n) === normalizedId) && pass === "rith";

      if (isValidId || isValidName) {
        localStorage.setItem(
          "igs_user",
          JSON.stringify({ username: id, role: "client" })
        );
        onLogin();
        return;
      }

      throw new Error("Invalid username or password");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Return") passwordRef.current.focus();
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Return") handleLogin();
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 animate-gradient-shift"></div>

      {/* Animated circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Logo */}
        <div
          className={`text-center mb-8 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <h1 className="text-7xl font-black mb-2 bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent animate-pulse-slow drop-shadow-2xl">
            IGS
          </h1>
          <p className="text-white text-xl font-semibold tracking-wider animate-fade-in-delay">
            Gaming System Team
          </p>
        </div>

        {/* Login card */}
        <div
          className={`w-full max-w-md backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 transition-all duration-1000 ${
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="space-y-6">
            {/* ID input */}
            <div className="group">
              <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wide">
                Your ID or Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userCredentials.userId}
                  maxLength={15}
                  onChange={(e) =>
                    setUserCredentials({
                      ...userCredentials,
                      userId: e.target.value,
                    })
                  }
                  onKeyDown={handleUsernameKeyDown}
                  className="w-full px-5 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/30 transition-all duration-300 group-hover:border-white/50"
                  placeholder="Enter your ID or Name"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none animate-shimmer"></div>
              </div>
            </div>

            {/* Password input */}
            <div className="group">
              <label className="block text-white font-semibold mb-2 text-sm uppercase tracking-wide">
                Password is "rith"
              </label>
              <div className="relative">
                <input
                  type="password"
                  ref={passwordRef}
                  value={userCredentials.password}
                  maxLength={15}
                  onChange={(e) =>
                    setUserCredentials({
                      ...userCredentials,
                      password: e.target.value,
                    })
                  }
                  onKeyDown={handlePasswordKeyDown}
                  className="w-full px-5 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/30 transition-all duration-300 group-hover:border-white/50"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none animate-shimmer"></div>
              </div>
            </div>

            {/* Login button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="relative w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative z-10">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Login as IGS Team"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-white/20 animate-pulse-fast"></div>
              </div>
            </button>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-300/50 text-white px-4 py-3 rounded-xl text-sm animate-shake">
                <span className="font-semibold">⚠️ {error}</span>
              </div>
            )}
          </div>
        </div>

        <p
          className={`text-center text-white/80 mt-6 text-sm transition-all duration-1000 delay-300 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          Secure Gaming System Access
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
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        @keyframes pulse-fast {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
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
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-shake {
          animation: shake 0.5s;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-pulse-fast {
          animation: pulse-fast 1s ease-in-out infinite;
        }
        .animate-fade-in-delay {
          animation: fade-in-delay 1s ease-out 0.5s both;
        }
      `}</style>
    </div>
  );
};

export default FormLoginClient;
