import Head from 'next/head';

const DefaultSEO: React.FC = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://my-saves.vercel.app';

  return (
    <Head>
      <title>MySaves - Save and Share YouTube Videos</title>
      <meta name="description" content="Save, share, and stream your favorite YouTube videos in one place." />
      <meta property="og:title" content="MySaves - Save and Share YouTube Videos" />
      <meta property="og:description" content="Save, share, and stream your favorite YouTube videos in one place." />
      <meta property="og:image" content={`${baseUrl}/cinema.webp`} />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="MySaves" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="MySaves - Save and Share YouTube Videos" />
      <meta name="twitter:description" content="Save, share, and stream your favorite YouTube videos in one place." />
      <meta name="twitter:image" content={`${baseUrl}/cinema.webp`} />
    </Head>
  );
};

export default DefaultSEO;
