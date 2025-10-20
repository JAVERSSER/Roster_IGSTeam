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

const FormLoginAdmin = ({ userCredentials, setUserCredentials, onLogin }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const passwordRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async () => {
    setError("");
    const username = userCredentials.userId.trim();
    const password = userCredentials.password.trim().toLowerCase();

    if (!username || !password) {
      return setError("Enter username and password");
    }

    setIsLoading(true);

    try {
      // ✅ Normalize input for checking
      const normalizedUsername = normalize(username);

      // 1️⃣ Check if input is a valid ID in localUsers
      const isValidId =
        localUsers.hasOwnProperty(username) &&
        localUsers[username] === password;

      // 2️⃣ Check if input matches allowed names (case-insensitive, no space)
      const isValidName =
        allowedNames.some((n) => normalize(n) === normalizedUsername) &&
        password === "rith";

      if (isValidId || isValidName) {
        localStorage.setItem(
          "igs_user",
          JSON.stringify({ username, role: "admin" })
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
    if (e.key === "Enter" || e.key === "Return") {
      passwordRef.current.focus();
    }
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Return") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-red-900 to-black animate-gradient-shift"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <div
          className={`text-center mb-8 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <h1 className="text-7xl font-black mb-2 bg-gradient-to-r from-red-400 via-red-500 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl">
            IGS
          </h1>
          <div className="inline-block px-4 py-1 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-full">
            <p className="text-red-400 text-sm font-bold tracking-widest uppercase animate-fade-in-delay">
              Administrator Access
            </p>
          </div>
        </div>

        <div
          className={`w-full max-w-md backdrop-blur-2xl bg-black/30 rounded-3xl p-8 shadow-2xl border border-red-500/20 transition-all duration-1000 ${
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse-slow"></div>

          <div className="space-y-6">
            {/* Username */}
            <div className="group">
              <label className=" text-red-400 font-semibold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Your ID or Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userCredentials.userId}
                  onChange={(e) =>
                    setUserCredentials({
                      ...userCredentials,
                      userId: e.target.value,
                    })
                  }
                  onKeyDown={handleUsernameKeyDown}
                  className="w-full px-5 py-4 bg-white/5 backdrop-blur-sm border-2 border-red-500/30 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all duration-300 group-hover:border-red-500/50"
                  placeholder="Enter ID or name"
                  maxLength={15}
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none animate-shimmer"></div>
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className=" text-red-400 font-semibold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                Password is "rith"
              </label>
              <div className="relative">
                <input
                  type="password"
                  ref={passwordRef}
                  value={userCredentials.password}
                  onChange={(e) =>
                    setUserCredentials({
                      ...userCredentials,
                      password: e.target.value,
                    })
                  }
                  onKeyDown={handlePasswordKeyDown}
                  className="w-full px-5 py-4 bg-white/5 backdrop-blur-sm border-2 border-red-500/30 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all duration-300 group-hover:border-red-500/50"
                  placeholder="Enter password"
                  maxLength={15}
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none animate-shimmer"></div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="relative w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-2xl font-bold text-lg overflow-hidden group hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
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
                    Authenticating...
                  </>
                ) : (
                  "Login"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-300 px-4 py-3 rounded-xl text-sm animate-shake flex items-start gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">{error}</span>
              </div>
            )}
          </div>
        </div>

        <div
          className={`text-center mt-6 transition-all duration-1000 delay-300 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 text-gray-400 text-xs">
            <svg
              className="w-4 h-4 text-green-500 animate-pulse"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944A11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001c0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secure Administrator Portal</span>
          </div>
        </div>
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
      `}</style>
    </div>
  );
};

export default FormLoginAdmin;
