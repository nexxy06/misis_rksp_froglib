import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Details.css';

const FrogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [frog, setFrog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFrog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/frogs/${id}`);
        if (!response.ok) {
          throw new Error('Лягушка не найдена');
        }
        const data = await response.json();
        setFrog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFrog();
  }, [id]);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  const createMarkup = (html) => {
    return { __html: html };
  };

  return (
    <div className="frog-detail">
      <button 
        onClick={() => navigate(-1)}
      >
        Назад
      </button>
      
      <h1>{frog.title}</h1>
      
      <img 
        src={`http://localhost:5000${frog.image}`} 
        alt={frog.title}
        onError={(e) => {
          e.target.src = '/placeholder-frog.jpg';
          e.target.onerror = null;
        }}
      />
      
      <div 
        className="frog-description"
        dangerouslySetInnerHTML={createMarkup(frog.description)}
      />
    </div>
  );
};

export default FrogDetail;