import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full bg-gradient-to-r from-indigo-700 via-indigo-900 to-purple-800 text-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10">
            <span className="font-extrabold text-lg tracking-tight">iT</span>
          </div>
          <div>
            <div className="font-semibold text-lg leading-tight">iTask</div>
            <div className="text-xs text-white/80">Manage todos simply • responsive</div>
          </div>
        </div>

        <div className="hidden md:flex gap-8 items-center">
          <a className="text-sm hover:underline cursor-pointer">Home</a>
          <a className="text-sm hover:underline cursor-pointer">Your Tasks</a>
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Open menu (not implemented)"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;



// import React from 'react'

// const Navbar = () => {
//   return (
//     <nav className='flex justify-around bg-indigo-900 text-white py-2'>
//         <div className="logo">
//             <span className="font-bold">iTask</span>
//         </div>
//         <ul className='flex gap-9'>
//             <li className='cursor-pointer hover:font-bold font-normal'>
//               <span className='font-bold invisible'>Home</span>
//               <span className='absolute'>Home</span>
//             </li>
//             <li className='cursor-pointer hover:font-bold font-normal'>
//               <span className='font-bold invisible'>Your Tasks</span>
//               <span className='absolute'>Your Tasks</span>
//             </li>
//         </ul>
//     </nav>
//   )
// }

// export default Navbar