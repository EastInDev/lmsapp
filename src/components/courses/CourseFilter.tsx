import { useState } from "react";

interface CourseFilterProps {
  onFilter: (search: string, startDate: string, endDate: string) => void;
}

export default function CourseFilter({ onFilter }: CourseFilterProps) {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(search, startDate, endDate);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="강좌 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <input
            type="date"
            placeholder="시작일"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <input
            type="date"
            placeholder="종료일"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        필터 적용
      </button>
    </form>
  );
}
