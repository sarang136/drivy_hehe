// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "../redux/apis/Adminapi";
import { setCredentials } from "../redux/slice";
import OtpInput from "react-otp-input";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [animateCard, setAnimateCard] = useState(false);

  const [sendOtp, { isLoading: sending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();

  // Animation on mount
  React.useEffect(() => {
    setTimeout(() => setAnimateCard(true), 100);
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await sendOtp({ email }).unwrap();
      setShowOtpSection(true);
      setSuccess("OTP sent successfully ✅");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err?.data?.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (otp.length !== 4) {
      setError("Please enter the 4-digit OTP.");
      return;
    }

    try {
      const response = await verifyOtp({ email, otp }).unwrap();

      const token = response?.token || response?.data?.token;
      const user = response?.user || response?.data?.user;

      if (token) {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(user));

        dispatch(setCredentials({ token, user }));

        setSuccess("OTP verified successfully ✅");

        setTimeout(() => {
          navigate("/");
        }, 400);
      } else {
        setError("Login failed: Token missing from server response.");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      setError(err?.data?.message || "OTP verification failed.");
    }
  };

  // Common input/button style for alignment
  const inputButtonClass =
    "w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all duration-200 text-base";

  // Fix for OtpInput: use renderInput prop to avoid "renderInput is not a function" error
  // See: https://github.com/devfolioco/react-otp-input/issues/187
  const renderOtpInput = (inputProps, idx) => (
    <input
      {...inputProps}
      key={idx}
      style={{
        width: "56px",
        height: "56px",
        fontSize: "2rem",
        textAlign: "center",
        border: "2px solid #CDFF00",
        borderRadius: "0.5rem",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        outline: "none",
        transition: "all 0.2s",
        ...(inputProps.focused
          ? {
              border: "2px solid #A3E635",
              boxShadow: "0 0 0 2px #CDFF00",
            }
          : {}),
      }}
      disabled={verifying}
      inputMode="numeric"
      autoComplete="one-time-code"
    />
  );

  return (
    <div className="relative h-screen w-full bg-gradient-to-b from-black via-[#CDFF00]/10 to-white overflow-hidden">
      {/* Top Black Section with animated logo */}
      <div className="h-1/2 bg-black flex justify-center items-start animate-fade-in-down">
        <img
          src="/Images/Group (1).png"
          alt="logo"
          className="py-8 h-32 w-32 sm:h-36 sm:w-36 object-contain animate-bounce-slow"
        />
      </div>
      <div className="h-1/2 bg-white" />

      {/* Animated Card */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4 sm:px-6 md:px-0 z-10">
        <div
          className={`bg-white border-2 border-[#CDFF00] rounded-2xl max-w-xl mx-auto shadow-[0_5px_30px_rgba(0,0,0,0.1)] min-h-[450px] flex flex-col justify-start py-10 px-6 sm:px-10 mt-10 transition-all duration-700 ${
            animateCard
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-8"
          }`}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-black tracking-tight animate-fade-in">
            Admin Login
          </h2>

          <form
            onSubmit={showOtpSection ? handleVerifyOtp : handleSendOtp}
            className="space-y-8"
            autoComplete="off"
          >
            <div className="flex flex-col gap-2 animate-fade-in">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputButtonClass}
                required
                disabled={showOtpSection}
                style={{
                  background: showOtpSection ? "#f3f3f3" : "white",
                  cursor: showOtpSection ? "not-allowed" : "auto",
                  minHeight: "56px",
                }}
              />
            </div>

            {showOtpSection && (
              <div className="flex flex-col gap-2 animate-fade-in-up justify-center items-center">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  OTP
                </label>
                <div className="flex justify-start w-full">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={4}
                    isInputNum
                    shouldAutoFocus
                    inputType="tel"
                    containerStyle={{
                      display: "flex",
                      gap: "0.75rem",
                      justifyContent: "center",
                      width: "100%",
                    }}
                    renderInput={renderOtpInput}
                  />
                </div>
              </div>
            )}

            <div className="min-h-[24px]">
              {success && (
                <div className="text-green-600 text-sm text-center animate-fade-in">
                  {success}
                </div>
              )}
              {error && (
                <div className="text-red-500 text-sm text-center animate-fade-in">
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={sending || verifying}
              className={`${inputButtonClass} bg-[#CDFF00] hover:bg-lime-500 text-black font-semibold rounded-md transition-all duration-300 shadow-md tracking-wide text-lg ${
                sending || verifying
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:scale-105"
              } animate-fade-in-up`}
              style={{
                minHeight: "56px",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
              }}
            >
              {showOtpSection
                ? verifying
                  ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="loader-dot" />
                      Verifying...
                    </span>
                  )
                  : "Verify OTP"
                : sending
                ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loader-dot" />
                    Sending...
                  </span>
                )
                : "Send OTP"}
            </button>
          </form>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-30px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeIn {
          0% { opacity: 0;}
          100% { opacity: 1;}
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-10px);}
        }
        .animate-fade-in-down { animation: fadeInDown 0.8s cubic-bezier(.4,0,.2,1) both;}
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(.4,0,.2,1) both;}
        .animate-fade-in { animation: fadeIn 1s cubic-bezier(.4,0,.2,1) both;}
        .animate-bounce-slow { animation: bounceSlow 2.5s infinite;}
        .loader-dot {
          display: inline-block;
          width: 1em;
          height: 1em;
          border-radius: 50%;
          background: #CDFF00;
          margin-right: 0.5em;
          animation: loader-bounce 0.8s infinite alternate;
        }
        @keyframes loader-bounce {
          0% { transform: scale(1);}
          100% { transform: scale(1.3);}
        }
        `}
      </style>
    </div>
  );
};

export default AdminLogin;
