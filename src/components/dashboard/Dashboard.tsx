'use client'

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const courseData = [
  { name: '웹 개발', 학생수: 120 },
  { name: '데이터 과학', 학생수: 98 },
  { name: '인공지능', 학생수: 86 },
  { name: '모바일 앱 개발', 학생수: 99 },
  { name: '클라우드 컴퓨팅', 학생수: 85 },
];

const userActivityData = [
  { day: '월', 활동량: 150 },
  { day: '화', 활동량: 230 },
  { day: '수', 활동량: 180 },
  { day: '목', 활동량: 275 },
  { day: '금', 활동량: 200 },
  { day: '토', 활동량: 170 },
  { day: '일', 활동량: 145 },
];

const completionRateData = [
  { name: '완료', value: 75 },
  { name: '미완료', value: 25 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 데이터 로딩 시뮬레이션
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return <div className="text-center">로딩 중...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>인기 강좌</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="학생수" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>주간 사용자 활동</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="활동량" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>강좌 완료율</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={completionRateData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {completionRateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
              <span>새로운 강좌 '블록체인 기초' 추가</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-4 h-4 bg-green-500 rounded-full"></span>
              <span>'인공지능 입문' 강좌 업데이트</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>
              <span>새로운 학습자 50명 등록</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-4 h-4 bg-red-500 rounded-full"></span>
              <span>시스템 성능 20% 향상</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}