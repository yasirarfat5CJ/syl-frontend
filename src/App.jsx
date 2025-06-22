// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarComponent from './components/navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/Register';
import SubjectPage from './pages/subjectPage';
import ModulesPage from './pages/Modulepage';
import EditModulePage from './pages/EditModulePage';
import AddSubjectPage from './pages/AddSubjectPage';
import ProtectedRoute from './components/ProtectedRoute';  // Import the ProtectedRoute component
import Chatbot from './components/Chatbot'; // adjust path as needed

import './App.css';
function App() {
  return (
    <Router>
      <NavbarComponent />
      <Routes>
      
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />  {/* Protected Home route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/subjects/:branch/:year" element={<ProtectedRoute element={<SubjectPage />} />} />  {/* Protected Subject page route */}
        <Route path="/subjects/:subjectId/modules" element={<ProtectedRoute element={<ModulesPage />} />} />  {/* Protected Modules page route */}
        <Route path="/edit-module/:subjectId/:moduleId" element={<ProtectedRoute element={<EditModulePage />} />}/>
        <Route path="/add-subject/:branch/:year"  element={ <ProtectedRoute element={<AddSubjectPage />}  />}  /> // 👈 this ensures only admins can access it 
       

      </Routes>
      <Chatbot/>
      <Footer />
    </Router>
  );
}

export default App;
