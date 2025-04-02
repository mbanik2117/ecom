
import "./globals.css";
import Navbar from "./components/Navbar";
import SessionProvider from './SessionProvider';



export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return (
      <SessionProvider> 
        <Navbar />
        {children} 
      </SessionProvider> 
  );
}