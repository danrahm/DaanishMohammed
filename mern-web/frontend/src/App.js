import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AccountBalances from './components/AccountBalances';
import AccountSummary from './components/AccountSummary';
import Registration from './components/Registration';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/balances" element={<AccountBalances />} />
        <Route path="/summary" element={<AccountSummary />} />
      </Routes>
    </Router>
  );
}

export default App;
