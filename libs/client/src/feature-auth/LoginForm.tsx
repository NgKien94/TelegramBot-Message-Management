import { Input } from '@message-management/shared/ui';

export function LoginForm() {
  return (
    <form className="w-3/4 flex flex-col justify-center items-center gap-y-3">
      <Input label="Email" type="email" />
      <Input label="Password" type="password" />
      <button className="block w-full mt-2 rounded px-3 py-2 bg-[var(--primary-color)] text-white">
        Submit
      </button>
    </form>
  );
}
