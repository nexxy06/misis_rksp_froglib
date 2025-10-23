// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import About from './components/About';
import Details from './components/Details';
import Table from './components/Table';
import Registration from './components/FeedbackForm';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Проверяем валидность токена при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/verify-token', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
        }
      } catch (error) {
        console.error('Ошибка проверки токена:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return <div className="loading">Проверка авторизации...</div>;
  }

  return (
    <Router>
      <div>
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/table" element={<Table />} />
            <Route path="/frogs/:id" element={<Details />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />
            } />
            <Route path="/admin" element={
              isAuthenticated ? <AdminPanel /> : <Navigate to="/login" />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Header({ isAuthenticated, onLogout }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>Froglib</h1>
        <nav>
          <ul>
            <li><Link to="/">О сайте</Link></li>
            <li><Link to="/table">Статьи</Link></li>
            <li><Link to="/registration">Добавить статью</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/admin">Админ-панель</Link></li>
                <li>
                  <button onClick={onLogout} className="logout-btn">
                    Выйти
                  </button>
                </li>
              </>
            ) : (
              <li><Link to="/login">Вход для админа</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default App;