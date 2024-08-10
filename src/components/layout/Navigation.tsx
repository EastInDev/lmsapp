'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoginModal from '@/components/auth/LoginModal';

export default function Navigation() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 로그인 상태 확인
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('/api/auth/check');
      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Failed to check login status:', error);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        setIsLoggedIn(false);
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">LMS 시스템</Link>
        <div className="space-x-4">
          <Link href="/courses">강좌</Link>
          {isLoggedIn ? (
            <>
              <Link href="/profile">프로필</Link>
              <button onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <button onClick={() => setIsLoginModalOpen(true)}>로그인</button>
          )}
        </div>
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setIsLoginModalOpen(false);
        }}
      />
    </nav>
  );
}