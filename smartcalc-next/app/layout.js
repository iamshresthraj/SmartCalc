import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata = {
  title: 'SmartCalc – Interactive Financial Learning Calculator',
  description: 'An interactive, educational financial calculator for understanding SIP, SWP, Top-Up SIP, Goal-Based Investment, and Retirement Planning. Designed for investor education.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body style={{ fontFamily: 'var(--font-montserrat), Montserrat, Arial, Verdana, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
