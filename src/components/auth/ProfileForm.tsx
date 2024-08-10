'use client';

import { useState, useEffect } from 'react';

export default function ProfileForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // 여기서 사용자 정보를 가져오는 API 호출
    // 지금은 더미 데이터를 사용합니다.
    setName('John Doe');
    setEmail('john@example.com');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에 프로필 업데이트 로직 구현
    console.log('Profile updated:', { name, email });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2">이름</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2">이메일</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
        프로필 업데이트
      </button>
    </form>
  );
}