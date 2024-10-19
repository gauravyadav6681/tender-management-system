import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPanel from './components/Adminpanel';
import Login from './components/Login';
import UserView from './components/UserView';
import './App.css'; 
 

function App() {
  return (
    <Router>
      <div>
       
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/user" element={<UserView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
