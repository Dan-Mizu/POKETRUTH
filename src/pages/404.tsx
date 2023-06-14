import Image from 'next/image';
import * as React from 'react';

import BackgroundMusic from '@/components/BackgroundMusic';
import CenterSection from '@/components/layout/CenterSection';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import Seo from '@/components/Seo';

import Jebaited from '~/images/jebaited.webp';

export default function NotFoundPage() {
  return (
    <Layout>
      <Seo templateTitle='JEBAITED' />
      <BackgroundMusic src='/audio/jebaited.ogg' />

      <CenterSection>
        {/* icon */}
        <a href='https://youtu.be/d1YBv2mWll0'>
          <Image src={Jebaited} alt='jebaited' />
        </a>

        {/* header */}
        <h1 className='mt-8 text-4xl text-white md:text-6xl'>
          YOU GOT JEBAITED
        </h1>

        {/* go back */}
        <ArrowLink
          variant='light'
          className='mt-4 text-white md:text-lg'
          href='/'
        >
          Click of Shame
        </ArrowLink>
      </CenterSection>
    </Layout>
  );
}
