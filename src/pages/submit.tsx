import { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';

const SubmitPage: NextPage = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit video');
      }

      const data = await response.json();
      router.push(`/videos/${data.id}`);
    } catch (err) {
      setError('Failed to submit video. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Submit a Video"
        description="Add a new YouTube video to MySaves"
        ogUrl="/submit"
        ogImage="/cinema.webp"
      />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Submit a Video</h1>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="mb-4">
            <label htmlFor="url" className="block text-white text-sm font-bold mb-2">
              YouTube URL
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/..."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4 bg-white rounded-lg p-2">{error}</p>}
          <div className="flex items-center justify-between font-broadway text-xxl">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded focus:outline-none focus:shadow-outline ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default SubmitPage;
