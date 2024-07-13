import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'MySaves' }) => {
  const router = useRouter();

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/cinema.webp')" }}
    >
      <Head>
        <title>{title}</title>
        <meta name="description" content="Save, Share, and Stream YouTube videos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="text-white sticky top-0 z-10 min-w-full bg-black/10 md:py-10 shadow-sm">
        <nav className="container mx-auto px-4 min-w-full">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-4xl md:text-7xl font-bold font-aliens md:-mt-20">
              MySaves
            </Link>
            <ul className="flex space-x-2 md:space-x-4 font-broadway md:text-2xl mt-9 md:mt-2">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:underline">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#explore" className="hover:underline">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:underline">
                  Submit
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">{children}</div>
      </main>

      <footer className="bg-black/10 py-4 mt-8 shadow-sm flex justify-center items-center gap-2">
        <p className="text-sm mt-4">&copy; {new Date().getFullYear()}</p>
        <p className="font-aliens text-lg">MySaves. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
