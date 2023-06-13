import * as React from 'react';

const BarChart = dynamic(() => import('@/components/BarChart'), { ssr: false });

import dynamic from 'next/dynamic';
import Image from 'next/image';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import omegalul from '~/images/omegalul.webp';

export default function HomePage() {
  return (
    <Layout>
      <Seo />

      <main>
        <section className='bg-black'>
          <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
            <Image src={omegalul} alt='omegalul' width={80} />

            <BarChart />
            <footer className='absolute bottom-2 text-gray-700'></footer>
          </div>
        </section>
      </main>
    </Layout>
  );
}
