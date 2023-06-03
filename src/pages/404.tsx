import Image from 'next/image';
import Script from 'next/script';
import * as React from 'react';

import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import Seo from '@/components/Seo';

import Jebaited from '~/images/jebaited.webp';

export default function NotFoundPage() {
  return (
    <Layout>
      <Seo templateTitle='JEBAITED' />

      {/* auto play music or wait for interaction */}
      <Script id='show-banner' strategy='afterInteractive'>
        {`document.getElementById("backgroundMusic").play().catch((error) => {
    document.addEventListener('click', () => {
      document.getElementById("backgroundMusic").play()
    }, { once: true } )})`}
      </Script>
      <audio id='backgroundMusic' loop autoPlay defaultValue={0.25}>
        <source src='/audio/jebaited.ogg' type='audio/ogg' />
      </audio>

      {/* visible page */}
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
