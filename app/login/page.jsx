"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { HiEye, HiEyeOff } from "react-icons/hi";
import LineLoader from "../components/loadings/LineLoader";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token.trim() !== "") {
      router.replace("/dashboard");
    }
  }, [router]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(""); // reset error

    const isEmailValid = validateEmail(email);
    const isPasswordValid = password.trim() !== "";

    setEmailValid(isEmailValid);
    setPasswordValid(isPasswordValid);

    if (!isEmailValid || !isPasswordValid) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("userId", res.data.user.id); 
      router.replace("/dashboard");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      setIsLoading(false);
    }
  };
  

  return (
    <>
      {isLoading && <LineLoader />}
      <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4 backdrop-blur-lg">
        <div className="bg-blue-950 max-w-4xl w-full flex flex-col lg:flex-row items-center justify-between rounded-lg overflow-hidden">
          {/* Ilustrasi */}
          <div className="hidden lg:block w-1/2 p-4">
            <img
              src="/images/ilustrasi1.png"
              alt="Ilustrasi"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Form Login */}
          <div className="w-full lg:w-1/2 p-6 lg:p-10">
            <h1 className="text-white text-3xl font-semibold mb-6 text-center">
              Login
            </h1>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-white text-md mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailValid(true);
                  }}
                  className={`w-full bg-[#d0d6db66] rounded-[20px] h-[50px] px-4 text-white placeholder-[#cdcdcd] text-base outline-none ${
                    !emailValid ? "border-2 border-red-500" : ""
                  }`}
                  placeholder="Enter Email"
                  required
                />
                {!emailValid && (
                  <p className="text-sm text-red-400 mt-1">
                    Invalid email format
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-white text-md mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordValid(true);
                    }}
                    className={`w-full bg-[#d0d6db66] rounded-[20px] h-[50px] px-4 pr-12 text-white placeholder-[#cdcdcd] text-base outline-none ${
                      !passwordValid ? "border-2 border-red-500" : ""
                    }`}
                    placeholder="Enter Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 focus:outline-none"
                  >
                    {showPassword ? (
                      <HiEye className="text-gray-400 w-5 h-5" />
                    ) : (
                      <HiEyeOff className="text-gray-400 w-5 h-5" />
                    )}
                  </button>
                </div>
                {!passwordValid && (
                  <p className="text-sm text-red-400 mt-1">
                    Password cannot be empty
                  </p>
                )}
              </div>

              {/* Error */}
              {error && <div className="text-red-400 text-sm">{error}</div>}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-[50px] text-white text-lg rounded-[20px] transition duration-300 ease-in-out 
                ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-[#397bf4] hover:bg-[#2f6ce0] cursor-pointer"
                }`}
                          >
                {isLoading ? (
                  <span className="flex justify-center items-center gap-2">
                    <svg
                      className="w-5 h-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>
            {/* Footer */}
            <div className="mt-8 text-center w-full text-sm text-white/70">
              &copy; {new Date().getFullYear()} MyCompany. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
