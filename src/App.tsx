import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "Pages/Home";
import Login from "Pages/Login";
import Register from "Pages/Register";
import HomeTemplate from "Template/HomeTemplate";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="" element={<HomeTemplate />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
