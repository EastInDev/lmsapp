"use client";

import { useState, useEffect } from "react";

interface CourseMaterial {
  id: number;
  title: string;
  file_path: string;
  upload_date: string;
}

interface CourseMaterialsProps {
  courseId: string;
  isInstructor: boolean;
}

export default function CourseMaterials({
  courseId,
  isInstructor,
}: CourseMaterialsProps) {
  console.log("CourseMaterials Props:", { courseId, isInstructor });

  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, [courseId]);

  const fetchMaterials = async () => {
    try {
      console.log("Fetching materials for course:", courseId);
      const response = await fetch(`/api/courses/${courseId}/materials`);
      console.log("Materials API response:", response);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched materials:", data);
        setMaterials(data);
      } else {
        console.error("Failed to fetch materials");
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      const response = await fetch(`/api/courses/${courseId}/materials`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setTitle("");
        setFile(null);
        fetchMaterials();
      }
    } catch (error) {
      console.error("Error uploading material:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">강의 자료</h2>
      {isInstructor && (
        <form onSubmit={handleUpload} className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="자료 제목"
            className="mr-2 p-2 border rounded"
            required
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mr-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            업로드
          </button>
        </form>
      )}
      <ul>
        {materials.map((material) => (
          <li key={material.id} className="mb-2">
            <a
              href={`/api/courses/${courseId}/materials/${material.id}`}
              download={material.title}
              className="text-blue-500 hover:underline"
            >
              {material.title}
            </a>
            <span className="text-sm text-gray-500 ml-2">
              ({new Date(material.upload_date).toLocaleDateString()})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
