import { createBrowserRouter, Link, Outlet, RouterProvider } from "react-router-dom";
import NotFound from "./components/NotFound";
import Home from "./pages/home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ListSP from "./pages/ListSP";
import ChiTietSP from "./pages/ChiTietSP";
import CheckoutPage from "./pages/checkout";
import { Button } from "antd";
import DrawerTuVan from "./components/DrawerTuVan";
import { useState } from "react";
import imgg from '../public/css/icon/icon_chatcall.svg'



const Layout = () => {

  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <div>
        <Header />
        <Outlet />
        <Footer />

        {/* Nút Liên hệ */}      
        <img
        onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            cursor: 'pointer',
          }}
          src={imgg}
          width={60}
          alt=""
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.opacity = '1';
          }}
        />

        <DrawerTuVan
            toggleDrawer={toggleDrawer}
            open={open}
        />
    </div>
  )
}

export default function App() {


  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,

      children: [
        {
          index: true, 
          element: 
            <Home />,
          errorElement: <NotFound />,
        },       
        {
          path: "searchsp",
          element: 
            <ListSP />,         
          errorElement: <NotFound />,
        }, 
        {
          path: "chitietsp",
          element: 
            <ChiTietSP />,         
          errorElement: <NotFound />,
        }, 
        {
          path: "checkout",
          element: 
            <CheckoutPage />,         
          errorElement: <NotFound />,
        }, 
        
        
        // {
        //   path: "myaccount",
        //   element: 
        //   <ProtectedRoute>
        //     <MyAccount />
        //   </ProtectedRoute>,
        //   errorElement: <NotFound />,
        // }, 
       
       
      ],
    },

  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}