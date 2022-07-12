import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SubString from "./components/SubString";

import "./App.css";
import Login from "./components/Login/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SubString />}/>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
