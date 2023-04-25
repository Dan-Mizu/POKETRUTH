import Image from 'next/image';
import Script from 'next/script';
import * as React from 'react';

import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import UnderlineLink from '@/components/links/UnderlineLink';
import Seo from '@/components/Seo';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
import Badass from '~/images/Badass.gif';
import UhOh from '~/images/UhOh.png';

export default function HomePage() {
  return (
    <Layout>
      <Seo />

      {/* auto play music or wait for interaction */}
      <Script id='show-banner' strategy='afterInteractive'>
        {`document.getElementById("backgroundMusic").play().catch((error) => {
    document.addEventListener('click', () => {
      document.getElementById("backgroundMusic").play()
    }, { once: true } )})`}
      </Script>
      <audio id='backgroundMusic' loop autoPlay defaultValue={0.25}>
        <source src='/audio/blue-jeans-shit-edition.ogg' type='audio/ogg' />
      </audio>

      {/* visible page */}
      <main>
        <section className='bg-black'>
          <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
            <Image
              src={UhOh}
              alt='badass'
              width={200}
              style={{
                position: 'absolute',
                marginLeft: '50px',
                marginBottom: '570px',
                zIndex: 1,
              }}
            />
            <Image
              src={Badass}
              alt='badass'
              width={420}
              style={{
                position: 'relative',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
            <h1 className='mt-4 text-gray-100'>INDUSTRY SECRETS EXPOSED</h1>
            <p className='text-med mt-2 text-gray-100'>
              SUBSCRIBE TO MY TRUTH FORUM® SUBSCRIPTION BASED MAILING LIST™ FOR
              THE TRUTH
            </p>
            &nbsp;
            <ButtonLink variant='light' href='https://youtu.be/2lEpY6hIg6w'>
              SUBSCRIBE ➔
            </ButtonLink>
            <footer className='absolute bottom-2 text-gray-700'>
              © {new Date().getFullYear()}{' '}
              <UnderlineLink href='https://twitter.com/Pokediger1'>
                the REAL pokilawls
              </UnderlineLink>
            </footer>
          </div>
        </section>
      </main>
    </Layout>
  );
}
