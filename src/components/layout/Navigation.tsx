"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LoginModal from "@/components/auth/LoginModal";
import ProfileMenu from "@/components/profile/ProfileMenu";
import Image from "next/image";

export default function Navigation() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch("/api/auth/check");
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to check login status:", error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <Image
            src="/images/TUKOREA.png"
            alt="TUKOREA LMS"
            width={150}
            height={40}
          />
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            href="/courses"
            className="hover:text-gray-300 transition-colors"
          >
            강좌 목록
          </Link>
          {isLoggedIn &&
            (user?.role === "admin" || user?.role === "instructor") && (
              <Link
                href="/courses/manage"
                className="hover:text-gray-300 transition-colors"
              >
                강좌 관리
              </Link>
            )}
          {isLoggedIn ? (
            <ProfileMenu
              user={user}
              onLogout={() => {
                setIsLoggedIn(false);
                setUser(null);
              }}
            />
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              로그인/회원가입
            </button>
          )}
        </div>
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setIsLoginModalOpen(false);
          checkLoginStatus();
        }}
      />
    </nav>
  );
}
