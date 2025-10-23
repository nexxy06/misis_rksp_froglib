import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [frogs, setFrogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFrogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/frogs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFrogs(data);
      } else {
        setError('Ошибка загрузки данных');
      }
    } catch (error) {
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/frogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setFrogs(frogs.filter(frog => frog.id !== id));
        alert('Статья успешно удалена');
      } else {
        const data = await response.json();
        alert(data.error || 'Ошибка при удалении');
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  useEffect(() => {
    fetchFrogs();
  }, []);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-panel">
      <h1>Админ-панель - Управление статьями</h1>
      <div className="frogs-table-container">
        <table className="frogs-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Изображение</th>
              <th>Название</th>
              <th>Место обитания</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {frogs.map(frog => (
              <tr key={frog.id}>
                <td>{frog.id}</td>
                <td>
                  <img 
                    src={`http://localhost:5000${frog.image}`} 
                    alt={frog.title}
                    className="admin-image"
                  />
                </td>
                <td>{frog.title}</td>
                <td>{frog.habitat}</td>
                <td>{new Date(frog.created_at).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(frog.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {frogs.length === 0 && (
        <div className="no-data">Нет данных для отображения</div>
      )}
    </div>
  );
};

export default AdminPanel;