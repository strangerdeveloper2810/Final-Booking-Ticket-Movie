import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "Pages/Home";
import Login from "Pages/Login";
import Register from "Pages/Register";
import HomeTemplate from "Template/HomeTemplate";

const App: React.FC = () => {
  return (
    <div className="w-screen">
      <Routes>
        <Route path="" element={<HomeTemplate />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default App;
