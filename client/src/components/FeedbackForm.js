import React, { useState } from 'react';
import './FeedbackForm.css';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    habitat: '',
    phone: '',
    description: '',
    photo: null,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('habitat', formData.habitat);
    data.append('phone', formData.phone);
    data.append('description', formData.description);
    data.append('photo', formData.photo);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Ошибка сервера');
      }

      // const result = await response.json();
      setMessage(`Данные отправлены!`); // Файл: ${result.data.photo_filename}
    } catch (err) {
      setError(`Ошибка: ${err.message}`);
    }
  };

  return (
    <section id="registration">
    <div>
      <h2>Добавить статью</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Ваша почта: </label>
          <input
            type="email"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Название/вид: </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Место обитания: </label>
          <input
            type="text"
            id="habitat"  
            name="habitat"
            value={formData.habitat}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Фото: </label>
          <input
            type="file"
            name="photo"
            onChange={handleFileChange}
            accept="image/*"
            required
          />
        </div>

        <div>
          <label>Статья(.txt, .html): </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Отправить</button> 
      </form>
    </div>
    </section>
  );
};

export default FeedbackForm;