import React, { useState } from 'react';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';

const NewsEditor = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    details_en: '',
    details_ar: '',
    image: null
  });
  
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMarkdownChange = (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    try {
      const newsData = new FormData();
      
      newsData.append('title_en', formData.title_en);
      newsData.append('title_ar', formData.title_ar);
      newsData.append('details_en', formData.details_en);
      newsData.append('details_ar', formData.details_ar);
      
      if (formData.image) {
        newsData.append('image', formData.image);
      }
      
      await axios.post(`/news`, newsData);
      
      setMessage({ type: 'success', text: 'News created successfully!' });
      setFormData({
        title_en: '',
        title_ar: '',
        details_en: '',
        details_ar: '',
        image: null
      });
      setPreview(null);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Error creating news'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const editorStyle = {
    marginBottom: '20px',
  };

  const formStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '40px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color:'black'
  };

  const submitButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  };

  const messageStyle = {
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    backgroundColor: message?.type === 'success' ? '#d4edda' : '#f8d7da',
    color: message?.type === 'success' ? '#155724' : '#721c24',
  };

  return (
    <div style={formStyle}>
      <h2 style={{ marginBottom: '20px' }}>Add New News</h2>
      
      {message && (
        <div style={messageStyle}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>English Title:</label>
          <input
            type="text"
            name="title_en"
            value={formData.title_en}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>
        
        <div>
          <label style={labelStyle}>Arabic Title:</label>
          <input
            type="text"
            name="title_ar"
            value={formData.title_ar}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: '10px' }}
          />
          {preview && (
            <div>
              <img 
                src={preview} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: '200px' }} 
              />
            </div>
          )}
        </div>
        
        <div style={editorStyle}>
          <label style={labelStyle}>English Content (Markdown):</label>
          <MDEditor
            value={formData.details_en}
            onChange={(value) => handleMarkdownChange(value, 'details_en')}
            preview="edit"
            height={300}
          />
        </div>
        
        <div style={editorStyle}>
          <label style={labelStyle}>Arabic Content (Markdown):</label>
          <MDEditor
            value={formData.details_ar}
            onChange={(value) => handleMarkdownChange(value, 'details_ar')}
            preview="edit"
            height={300}
            textDirection="rtl"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading} 
          style={submitButtonStyle}
        >
          {isLoading ? 'Saving...' : 'Add News'}
        </button>
      </form>
    </div>
  );
};

export default NewsEditor;