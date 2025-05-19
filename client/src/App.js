// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './components/About';
import Details from './components/Details';
import Table from './components/Table';
import Registration from './components/FeedbackForm';

function App() {
  return (
      <Router>
        <div>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<About />} />
              <Route path="/table" element={<Table />} />
              <Route path="/frogs/:id" element={<Details />} />
              <Route path="/registration" element={<Registration />} />
            </Routes>
          </main>
        </div>
      </Router>
  );
}

function Header() {
  return (
    <header>
      <h1>Froglib</h1>
      <nav>
        <ul>
          <li><Link to="/">О лягушках</Link></li>
          {/* <li><Link to="/frogs/:id">Фото</Link></li> */}
          <li><Link to="/table">Статьи</Link></li>
          <li><Link to="/registration">Добавить статью</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default App;