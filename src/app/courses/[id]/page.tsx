import CourseDetail from '@/components/courses/CourseDetail';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <CourseDetail id={params.id} />
    </div>
  );
}