import Dashboard from '@/components/dashboard/Dashboard';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">대시보드</h1>
      <Dashboard />
    </div>
  );
}