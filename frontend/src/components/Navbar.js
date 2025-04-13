"use client"
 
 import { useState } from "react"
 import Link from "next/link"
 import { usePathname } from "next/navigation"
 import { motion } from "framer-motion"
 import { Menu, X, Leaf } from "lucide-react"
 
 export default function Navbar() {
   const [isOpen, setIsOpen] = useState(false)
   const pathname = usePathname()
 
   const toggleMenu = () => {
     setIsOpen(!isOpen)
   }
 
   const navItems = [
     { name: "Home", path: "/" },
     { name: "Form", path: "/form" },
     { name: "Results", path: "/response" },
   ]
 
   return (
     <nav className="fixed top-0 w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md z-50 shadow-sm">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex justify-between h-16">
           <div className="flex items-center">
             <Link href="/" className="flex items-center">
               <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
               <span className="ml-2 text-lg font-semibold text-neutral-800 dark:text-white">CarbonIQ</span>
             </Link>
           </div>
 
           {/* Desktop navigation */}
           <div className="hidden md:flex items-center space-x-8">
             {navItems.map((item) => (
               <Link
                 key={item.path}
                 href={item.path}
                 className={`relative px-1 py-2 text-sm font-medium transition-colors ${
                   pathname === item.path
                     ? "text-green-600 dark:text-green-400"
                     : "text-neutral-600 hover:text-green-600 dark:text-neutral-300 dark:hover:text-green-400"
                 }`}
               >
                 {item.name}
                 {pathname === item.path && (
                   <motion.div
                     layoutId="navbar-indicator"
                     className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400"
                     initial={false}
                     transition={{ type: "spring", stiffness: 500, damping: 30 }}
                   />
                 )}
               </Link>
             ))}
           </div>
 
           {/* Mobile menu button */}
           <div className="md:hidden flex items-center">
             <button
               onClick={toggleMenu}
               className="inline-flex items-center justify-center p-2 rounded-md text-neutral-600 dark:text-neutral-300 hover:text-green-600 dark:hover:text-green-400 focus:outline-none"
               aria-expanded="false"
             >
               <span className="sr-only">Open main menu</span>
               {isOpen ? (
                 <X className="block h-6 w-6" aria-hidden="true" />
               ) : (
                 <Menu className="block h-6 w-6" aria-hidden="true" />
               )}
             </button>
           </div>
         </div>
       </div>
 
       {/* Mobile menu */}
       <motion.div
         className="md:hidden"
         initial={false}
         animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
         transition={{ duration: 0.2 }}
         style={{ overflow: "hidden" }}
       >
         <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-neutral-900">
           {navItems.map((item) => (
             <Link
               key={item.path}
               href={item.path}
               className={`block px-3 py-2 rounded-md text-base font-medium ${
                 pathname === item.path
                   ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
                   : "text-neutral-600 hover:bg-green-50 dark:text-neutral-300 dark:hover:bg-green-900/10"
               }`}
               onClick={() => setIsOpen(false)}
             >
               {item.name}
             </Link>
           ))}
         </div>
       </motion.div>
     </nav>
   )
 }