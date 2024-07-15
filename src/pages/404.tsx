import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';

const Custom404: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." ogUrl="/404" />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-2xl text-white mb-8">Oops! Page not found.</p>
          <p className="text-gray-500 mb-8">The page you are looking for does not exist or has been moved.</p>
          <div className="space-x-4">
            <button
              onClick={() => router.back()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Go Back
            </button>
            <Link
              href="/"
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Custom404;
