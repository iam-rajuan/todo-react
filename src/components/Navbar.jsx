// import React from 'react'

// const Navbar = () => {
//     return (
//         <nav className='flex justify-around bg-indigo-900 text-white py-2'>
//             <div className="logo">
//                 <span className="font-bold">iTask</span>
//             </div>
//             <ul className='flex gap-9'>
//                 <li className='cursor-pointer hover:font-bold font-normal relative'>Home</li>
//                 <li className='cursor-pointer hover:font-bold font-normal relative'>Your Tasks</li>
//             </ul>
//         </nav>
//     )
// }

// export default Navbar


import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex justify-around bg-indigo-900 text-white py-2'>
        <div className="logo">
            <span className="font-bold">iTask</span>
        </div>
        <ul className='flex gap-9'>
            <li className='cursor-pointer hover:font-bold font-normal'>
              <span className='font-bold invisible'>Home</span>
              <span className='absolute'>Home</span>
            </li>
            <li className='cursor-pointer hover:font-bold font-normal'>
              <span className='font-bold invisible'>Your Tasks</span>
              <span className='absolute'>Your Tasks</span>
            </li>
        </ul>
    </nav>
  )
}

export default Navbar