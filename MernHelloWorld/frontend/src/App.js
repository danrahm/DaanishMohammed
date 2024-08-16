// frontend/src/App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import HelloWorld from "./components/hello_world";

const App = () => {
  return (
      <div>
        <Routes>
          <Route exact path="/" element={<HelloWorld />} />
        </Routes>
      </div>
  );
};

export default App;
