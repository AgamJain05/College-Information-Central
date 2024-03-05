import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Link, Outlet } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";
const Navbar = () => {
    return (
        <>
            <nav className="flex items-center justify-between bg-gray-900 p-4">
                <div className="flex items-center">
                    <Link to="/" className="text-white text-2xl font-bold ml-2 p-2">CIC</Link>

                    <div className="relative">
                        <CiSearch size='1.5rem' color='white' className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                        <input type="text" placeholder="Search for blog posts..." className="bg-gray-800 text-white border border-gray-700 rounded-full pl-3 pr-10 py-1 focus:outline-none focus:border-blue-500" />
                    </div>

                </div>
                <div className="flex items-center space-x-4">


                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-white cursor-pointer ml-4 flex items-center">
                        <FontAwesomeIcon icon={faPen} />
                        <span className="ml-2">Write</span>
                    </div>

                    <Link to="/signin" className="bg-white text-gray-900 px-4 py-2 rounded inline-block">Sign In</Link>
                    <Link to="/signup" className="bg-gray-900 text-white px-4 py-2 rounded inline-block">Sign Up</Link>
                </div>
            </nav>
          <Outlet/>
        </>

    );
}

export default Navbar;