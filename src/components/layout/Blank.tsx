import * as React from 'react';

import Footer from '@/components/layout/Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* set background */}
      <div className='overflow-hidden bg-white'>
        {/* page's content */}
        <main>{children}</main>
        {/* footer */}
        <Footer />
      </div>
    </>
  );
}
