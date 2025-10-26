import React, { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { publicRoutes } from "./routes";
import { DefaultLayout } from "./components/Layout/Layout.js";
import { AuthProvider } from "./redux/AuthContext.js";

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
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
