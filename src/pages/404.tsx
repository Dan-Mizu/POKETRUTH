import Image from 'next/image';
import * as React from 'react';

import BackgroundMusic from '@/components/BackgroundMusic';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import Seo from '@/components/Seo';

import Jebaited from '~/images/jebaited.webp';

export default function NotFoundPage() {
  return (
    <Layout>
      <Seo templateTitle='JEBAITED' />

      <BackgroundMusic src='/audio/jebaited.ogg' />

      <main>
        <section className='bg-black'>
          <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
            <a href='https://youtu.be/d1YBv2mWll0'>
              <Image src={Jebaited} alt='jebaited' />
            </a>
            <h1 className='mt-8 text-4xl text-white md:text-6xl'>
              YOU GOT JEBAITED
            </h1>
            <ArrowLink
              variant='light'
              className='mt-4 text-white md:text-lg'
              href='/'
            >
              Click of Shame
            </ArrowLink>
          </div>
        </section>
      </main>
    </Layout>
  );
}
