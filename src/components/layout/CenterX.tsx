import * as React from 'react';

export default function CenterX({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* center content */}
      <section className='layout relative flex min-h-screen flex-col overflow-hidden px-12 text-center'>
        {/* page's content */}
        {children}
      </section>
    </>
  );
}
