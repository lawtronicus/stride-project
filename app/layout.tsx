import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Stride · Samcheok 2027',description:'A clear plan. One run at a time.',manifest:'/manifest.webmanifest',icons:{icon:'/favicon.svg',apple:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
