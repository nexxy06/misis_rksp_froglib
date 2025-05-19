import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Table.css';

const Table = () => {
  const [frogs, setFrogs] = useState([]);
  const [filteredFrogs, setFilteredFrogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFrogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/frogs');
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных');
        }
        const data = await response.json();
        setFrogs(data);
        setFilteredFrogs(data); // отфильтрованный список
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFrogs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFrogs(frogs);
    } else {
      const filtered = frogs.filter(frog => 
        frog.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFrogs(filtered);
    }
  }, [searchTerm, frogs]);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="frog-gallery">
      <h2>Список статей</h2>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      {filteredFrogs.length === 0 && searchTerm.trim() !== '' && (
        <div className="no-results">Ничего не найдено по запросу "{searchTerm}"</div>
      )}
      
      <div className="frog-grid">
        {filteredFrogs.map(frog => (
          <div 
            key={frog.id} 
            className="frog-card"
            onClick={() => navigate(`/frogs/${frog.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <img 
              src={`http://localhost:5000${frog.image}`} 
              alt={frog.title}
              onError={(e) => {
                e.target.src = '/placeholder-frog.jpg';
                e.target.onerror = null;
              }}
            />
            <h3>{frog.title}</h3>
            <p>{frog.habitat}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;