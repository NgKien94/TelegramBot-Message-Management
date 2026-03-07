import clsx from 'clsx';
import { PiWarningCircle } from 'react-icons/pi';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage?: string;
}

export function Input({
  errorMessage = undefined,
  disabled = false,
  type = 'text',
  label,
  name,
  id,
  placeholder,
  children,
  className,
  ...rest
}: InputProps) {
  return (
    <div className={clsx('w-full', className)}>
      <label htmlFor={id} className="block mb-1 font-semibold text-sm">
        {label}
      </label>
      <input
        disabled={disabled}
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        className={clsx(
          'text-sm block px-2 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-0 w-full placeholder:text-gray-400 placeholder:font-normal font-medium transition duration-150 ease-linear',
          errorMessage
            ? ' text-gray-800 border-red-400 '
            : 'focus:border-blue-400  text-blue-400',
        )}
        {...rest}
      />
      {errorMessage && (
        <div className="flex justify-start items-center mt-1">
          <PiWarningCircle className="inline-block mr-1 text-lg text-red-600" />
          <span className="inline-block text-sm font-medium text-red-500">
            {errorMessage}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
