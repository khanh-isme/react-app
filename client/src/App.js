import React, { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { publicRoutes, privateRoutes } from "./routes";
import { DefaultLayout } from "./components/Layout/Layout.js";
import { AuthProvider } from "./redux/AuthContext.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Routes>
            {publicRoutes.map((route, index) => {
              const Layout = route.layout === null ? Fragment : DefaultLayout;
              const Page = route.component;

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}

            {privateRoutes.map((route, index) => {
              const Layout = route.layout === null ? Fragment : DefaultLayout;
              const Page = route.component;

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Page />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              );
            })}


            
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
