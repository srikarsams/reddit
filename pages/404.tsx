import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="-mt-12 flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-5xl text-gray-800">Page not found</h1>
      <Link href="/">
        <a className="px-4 py-2 text-blue-500 underline">Back to Home</a>
      </Link>
    </div>
  );
}
