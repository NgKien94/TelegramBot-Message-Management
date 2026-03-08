import { LoginForm } from '@message-management/client';

export default function Login() {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="form-container h-2/3 p-10 w-1/2 flex justify-center items-center shadow-[0_-4px_12px_rgba(0,0,0,0.05),0_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <LoginForm />
      </div>
    </div>
  );
}
