import React, { useState, useRef, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

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
    if (!userCredentials.userId || !userCredentials.password) {
      return setError("Enter username and password");
    }

    setIsLoading(true);
    try {
      // Local hardcoded admin login
      if (userCredentials.userId === "admin") {
        if (userCredentials.password === "rith") {
          localStorage.setItem(
            "igs_user",
            JSON.stringify({ username: "admin", role: "admin" })
          );
          onLogin();
          return;
        } else {
          throw new Error("Invalid password");
        }
      }

      // Firebase Auth login (email + password)
      await signInWithEmailAndPassword(
        auth,
        userCredentials.userId,
        userCredentials.password
      );

      localStorage.setItem(
        "igs_user",
        JSON.stringify({ username: userCredentials.userId, role: "admin" })
      );
      onLogin();
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
      {/* Animated dark gradient background with red accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-red-900 to-black animate-gradient-shift"></div>
      
      {/* Animated geometric shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>

      {/* Grid overlay effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Admin Badge with shield icon */}
        <div className={`text-center mb-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="inline-block relative mb-4">
            <div className="absolute inset-0 bg-red-500 blur-2xl opacity-50 animate-pulse-slow"></div>
            <div className="relative bg-gradient-to-br from-red-500 to-red-700 p-4 rounded-2xl shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h1 className="text-7xl font-black mb-2 bg-gradient-to-r from-red-400 via-red-500 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl">
            IGS
          </h1>
          <div className="inline-block px-4 py-1 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-full">
            <p className="text-red-400 text-sm font-bold tracking-widest uppercase animate-fade-in-delay">
              Administrator Access
            </p>
          </div>
        </div>

        {/* Login card with premium glass effect */}
        <div className={`w-full max-w-md backdrop-blur-2xl bg-black/30 rounded-3xl p-8 shadow-2xl border border-red-500/20 transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Top border glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse-slow"></div>
          
          <div className="space-y-6">
            {/* Username field */}
            <div className="group">
              <label className=" text-red-400 font-semibold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Username or ID
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
                  placeholder="Enter admin username"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none animate-shimmer"></div>
              </div>
            </div>

            {/* Password field */}
            <div className="group">
              <label className=" text-red-400 font-semibold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Password
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
                  placeholder="Enter admin password"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none animate-shimmer"></div>
              </div>
            </div>

            {/* Login button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="relative w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-2xl font-bold text-lg overflow-hidden group hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Login as Admin
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-white/10 animate-pulse-fast"></div>
              </div>
              {/* Corner highlights */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/30 rounded-br-2xl"></div>
            </button>

            {/* Error message with animation */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-300 px-4 py-3 rounded-xl text-sm animate-shake flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Security badge */}
        <div className={`text-center mt-6 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 text-gray-400 text-xs">
            <svg className="w-4 h-4 text-green-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Secure Administrator Portal</span>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        @keyframes pulse-fast {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes fade-in-delay {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
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

export default FormLoginAdmin;