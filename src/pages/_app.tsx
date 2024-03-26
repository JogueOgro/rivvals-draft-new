'use client';

import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { Montserrat } from 'next/font/google';

import { Toaster } from '@/components/ui/toaster';

import './_globals.css';

const Providers = dynamic(() => import('@/providers'), { ssr: false });
const inter = Montserrat({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <Providers>
        <Component {...pageProps} />
      </Providers>
      <Toaster />
    </main>
  );
}
