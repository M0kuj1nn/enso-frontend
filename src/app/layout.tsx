import localFont from 'next/font/local';

import './globals.css';

const onest = localFont({
  src: '../fonts/onest/Onest-VariableFont_wght.ttf',
});

const delaGothicOne = localFont({
  src: '../fonts/delta-gothic-one/DelaGothicOne-Regular.ttf',
  variable: '--font-dela',
});

const unbounded = localFont({
  src: '../fonts/unbounded/Unbounded-VariableFont_wght.ttf',
  variable: '--font-unbounded',
});

export const metadata = {
  title: 'Enso',
  description: 'Discord-like chat application',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang='ru'
      className={`${onest.className} ${delaGothicOne.variable} ${unbounded.variable} h-full antialiased`}
    >
      <body className='flex h-screen flex-col'>{children}</body>
    </html>
  );
}
