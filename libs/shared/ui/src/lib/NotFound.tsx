// import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-black bg-[var(--primary-color)]">
          404
        </h1>
        <p className="text-2xl font-light text-gray-600 mt-4">
          Oops! Page not found
        </p>
        <p className="text-gray-500 mt-4 mb-8">
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>
        <a
          href="/"
          className="px-4 py-2 bg-black bg-[var(--primary-color)] text-white rounded hover:opacity-80 transition duration-300"
        >
          Go back to homepage
        </a>
      </div>
    </div>
  );
}
