import {useState} from 'react'
import { Fragment } from 'react'; // là 1 component chỉ chứa thôi nó không có gì cả
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import {publicRoutes} from './routes'; 
import {DefaultLayout} from './components/Layout/Layout.js';
import { AuthProvider } from './redux/AuthContext.js';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='App'>
          
          <Routes>
            {publicRoutes.map( (route,index) => {
              const Layout = route.layout === null ? Fragment : DefaultLayout; //khi layout không được cấu hình trong route thì nó sẽ mặc định là undefine
              const Page = route.component; // trong component mà muốn đặt biến để sử dụng thì phải viết hoa chữ cái đầu      

              return <Route key={index} path={route.path} 
                element={               
                    <Layout>
                      <Page/>
                    </Layout>                           
                }/>
            })}
            
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App;

