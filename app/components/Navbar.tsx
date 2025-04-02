"use client";
import Link from "next/link";
import Image from "next/image"; // Import next/image
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import Head from "next/head";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ShoppingCart, Package, UserCircle2 } from "lucide-react"; // Icons

const Navbar = () => {
  const [user, setUser] = useState<null | User>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Optional: Close dropdown if user clicks outside (more robust than just timeout)
  // Consider adding this for better UX if needed.
  // useEffect(() => {
  //   const closeDropdown = (event: MouseEvent) => {
  //     // Check if the click is outside the dropdown area
  //     // Requires adding refs to the dropdown button and menu
  //     if (isDropdownOpen /* && !dropdownRef.current?.contains(event.target as Node) && !buttonRef.current?.contains(event.target as Node) */) {
  //        setIsDropdownOpen(false);
  //      }
  //   };
  //   document.addEventListener('mousedown', closeDropdown);
  //   return () => document.removeEventListener('mousedown', closeDropdown);
  // }, [isDropdownOpen]);


  // Auto-close dropdown after a delay
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isDropdownOpen) {
      timer = setTimeout(() => {
        setIsDropdownOpen(false);
      }, 3000); // Closes after 3 seconds
    }

    // Clear timeout if dropdown is closed manually or component unmounts
    return () => clearTimeout(timer);
  }, [isDropdownOpen]);


  return (
    <>
      {/* Consider moving Head to _app.js or specific page layouts for better SEO control */}
      <Head>
        <title>Shopstrider - Shop Electronics, Mobiles, Grocery, and Books - Amazing Deals!</title>
        <meta name="description" content="Your one-stop-shop for electronics, mobiles, grocery, and books. Get exclusive deals on Apple iPhones, PC parts, grocery items, and books for competitive exams!" />
        <meta name="keywords" content="electronics, mobiles, grocery, books, Apple iPhones, PC parts, competitive exam books, grocery deals, online shopping" />
        <meta name="author" content="shopstrider" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>

      <header className="bg-white shadow sticky top-0 z-40"> {/* Added sticky and z-index */}
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="Shopstrider Home"> {/* Added aria-label */}
            {/* Use next/image */}
            <Image
              src="/cv_6.jpeg" // Path relative to the `public` directory
              alt="Shopstrider Logo"
              width={40} // Base width (adjust if needed, based on sm:w-10 which is 2.5rem = 40px)
              height={40} // Base height (adjust if needed, based on sm:h-10 which is 2.5rem = 40px)
              className="h-8 w-8 sm:h-10 sm:w-10" // Tailwind classes still control visual size
              priority // Prioritize loading the logo (good for LCP)
            />
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm font-bold text-black">
              {!user && (
                <>
                  <li><Link href="/" className="transition hover:text-black/75">Home</Link></li>
                  <li><Link href="/policy" className="transition hover:text-black/75">Policy</Link></li>
                </>
              )}
               {/* Always show these core links */}
              <li>
                <Link href="/account" className="transition hover:text-black/75 flex items-center gap-1">
                  <UserCircle2 size={20} /> Account {/* Added text for clarity/accessibility */}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-black/75">Contact Us</Link>
              </li>
              <li>
                <Link href="/Cart" className="transition hover:text-black/75 flex items-center gap-1">
                  <ShoppingCart size={20} /> Cart
                </Link>
              </li>
              {user && ( // Only show Orders if logged in
                <li>
                  <Link href="/Order" className="transition hover:text-black/75 flex items-center gap-1">
                    <Package size={20} /> Orders
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Mobile Navigation & User Actions */}
          <div className="flex items-center gap-4">
             {/* User Auth Buttons (Desktop) */}
             <div className="hidden sm:flex sm:gap-4"> {/* Adjusted responsive breakpoint */}
               {user ? (
                 <button onClick={handleSignOut} className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700">
                   Logout
                 </button>
               ) : (
                 <>
                   <Link href="/login" className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700">
                     Login
                   </Link>
                   <Link href="/signup" className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-bold text-teal-600 transition hover:text-teal-600/75">
                     Register
                   </Link>
                 </>
               )}
             </div>

            {/* Mobile Menu Toggle */}
            <div className="relative"> {/* Container for button and dropdown */}
              <button
                onClick={toggleDropdown}
                className="block md:hidden rounded bg-gray-100 p-2.5 text-black transition hover:text-black/75"
                aria-haspopup="true" // Indicate it controls a menu
                aria-expanded={isDropdownOpen} // Indicate menu state
                aria-controls="mobile-menu" // Associate with the menu itself (optional, add id="mobile-menu" to the div below)
              >
                <span className="sr-only">Toggle menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Mobile Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  id="mobile-menu" // For aria-controls
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50 border border-gray-200" // Added border
                  role="menu" // Semantic role
                >
                  <nav className="p-2" onClick={() => setIsDropdownOpen(false)}> {/* Close on item click */}
                    <ul className="space-y-1 text-black font-bold"> {/* Reduced spacing */}
                      {!user ? (
                        <>
                          {/* Added Home/Policy to mobile */}
                          <li><Link href="/" role="menuitem" className="block rounded-lg px-4 py-2 text-sm hover:bg-gray-100 hover:text-black/75">Home</Link></li>
                          <li><Link href="/policy" role="menuitem" className="block rounded-lg px-4 py-2 text-sm hover:bg-gray-100 hover:text-black/75">Policy</Link></li>
                          <li><hr className="my-1" /></li>{/* Separator */}
                          <li><Link href="/login" role="menuitem" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 hover:text-black/75">Login</Link></li>
                          <li><Link href="/signup" role="menuitem" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 hover:text-black/75">Register</Link></li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Link href="/account" role="menuitem" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 hover:text-black/75">
                              <UserCircle2 size={18} /> Account
                            </Link>
                          </li>
                          <li>
                            <Link href="/Order" role="menuitem" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 hover:text-black/75">
                              <Package size={18} /> Orders
                            </Link>
                          </li>
                        </>
                      )}
                       {/* Common links for both states */}
                       <li>
                         <Link href="/Cart" role="menuitem" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 hover:text-black/75">
                           <ShoppingCart size={18} /> Cart
                         </Link>
                       </li>
                       <li>
                         <Link href="/contact" role="menuitem" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 hover:text-black/75">
                           Contact Us
                         </Link>
                       </li>
                       {user && (
                         <>
                         <li><hr className="my-1" /></li> {/* Separator */}
                         <li>
                           <button
                             onClick={handleSignOut}
                             role="menuitem"
                             className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-left text-sm hover:bg-gray-100 hover:text-black/75"
                           >
                              {/* Optional: Add logout icon */} Logout
                           </button>
                         </li>
                         </>
                       )}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
