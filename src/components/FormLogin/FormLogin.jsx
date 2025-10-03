import React from "react";

const FormLogin = ({ userCredentials, setUserCredentials, onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold mb-8 text-red-500">IGS</h1>
      <div className="w-full max-w-md bg-gray-300 rounded-lg p-8 shadow-lg">
        <div className="bg-red-500 text-white text-center py-3 rounded-lg mb-6">
          <h1 className="text-lg font-semibold">Form Login IGS</h1>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-2">User ID</label>
            <input
              type="text"
              value={userCredentials.userId}
              onChange={(e) =>
                setUserCredentials({ ...userCredentials, userId: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-red-400 rounded-full focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2">Password</label>
            <input
              type="password"
              value={userCredentials.password}
              onChange={(e) =>
                setUserCredentials({ ...userCredentials, password: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-red-400 rounded-full focus:outline-none focus:border-red-500"
            />
          </div>
          <button
            onClick={onLogin}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormLogin;
