"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 text-gray-700 ${
              activeTab === "login"
                ? "border-b-2 border-blue-500 text-gray-700"
                : ""
            }`}
            onClick={() => setActiveTab("login")}
          >
            로그인
          </button>
          <button
            className={`flex-1 py-2 text-black ${
              activeTab === "signup"
                ? "border-b-2 border-blue-500 text-gray-700"
                : ""
            }`}
            onClick={() => setActiveTab("signup")}
          >
            회원가입
          </button>
        </div>
        {activeTab === "login" ? (
          <LoginForm onLoginSuccess={onLoginSuccess} />
        ) : (
          <SignupForm onSignupSuccess={() => setActiveTab("login")} />
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
