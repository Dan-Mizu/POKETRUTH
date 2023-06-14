import * as React from 'react';

export default function CenterSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* center content */}
      <section className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
        {/* page's content */}
        {children}
      </section>
    </>
  );
}
