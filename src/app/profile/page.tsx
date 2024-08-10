import ProfileForm from '@/components/auth/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">사용자 프로필</h1>
      <ProfileForm />
    </div>
  );
}