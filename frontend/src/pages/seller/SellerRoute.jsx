import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/sidebar/Sidebar'
import { Outlet, Route, Routes } from 'react-router'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";    
import './index.css'



const SellerRoute = () => {
  
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <hr />
      <div className='app-content'>
        <Sidebar/>
        <Outlet/>
      </div>
    </div>
  )
}

export default SellerRoute
