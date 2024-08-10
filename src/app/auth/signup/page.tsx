import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">회원가입</h1>
      <SignupForm />
    </div>
  );
}