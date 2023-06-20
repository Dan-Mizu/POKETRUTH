import * as React from 'react';

const BarChart = dynamic(() => import('@/components/BarChart'), { ssr: false });

import dynamic from 'next/dynamic';
import Image from 'next/image';

import CenterSection from '@/components/layout/CenterSection';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import omegalul from '~/images/omegalul.webp';

export default function HomePage() {
  return (
    <Layout>
      <Seo templateTitle='OMEGALUL REPORT' />

      <CenterSection>
        {/* header */}
        <header className='absolute top-2'>
          <div className='flex items-center justify-center'>
            <Image src={omegalul} alt='omegalul' width={70} />
            <p className='text-5xl text-white'>MEGALUL REPORT</p>
          </div>
        </header>

        {/* graph */}
        <BarChart />
      </CenterSection>
    </Layout>
  );
}
