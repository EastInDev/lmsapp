'use client';

import { useState, useEffect } from 'react';
import { Content } from '@/types/content';

export default function ContentList({ courseId }: { courseId: string }) {
  const [contents, setContents] = useState<Content[]>([]);

  useEffect(() => {
    // 실제로는 여기서 API를 호출하여 콘텐츠 목록을 가져와야 합니다.
    // 지금은 더미 데이터를 사용합니다.
    const dummyContents: Content[] = [
      {
        id: '1',
        courseId: courseId,
        title: 'HTML 기초',
        type: 'video',
        url: 'https://example.com/html-basics',
        duration: 3600, // 1 hour
      },
      {
        id: '2',
        courseId: courseId,
        title: 'CSS 스타일링',
        type: 'document',
        url: 'https://example.com/css-styling.pdf',
      },
      {
        id: '3',
        courseId: courseId,
        title: 'JavaScript 퀴즈',
        type: 'quiz',
        url: 'https://example.com/js-quiz',
      },
    ];
    setContents(dummyContents);
  }, [courseId]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">강의 콘텐츠</h2>
      <ul className="space-y-4">
        {contents.map((content) => (
          <li key={content.id} className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
            <p className="text-gray-600 mb-2">유형: {content.type}</p>
            {content.type === 'video' && content.duration && (
              <p className="text-gray-600 mb-2">길이: {content.duration / 60} 분</p>
            )}
            <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              콘텐츠 보기
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}