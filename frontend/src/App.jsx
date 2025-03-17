import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // Fallback for local testing

  const [news, setNews] = useState(null); // Null initially to handle loading state
  const [cars, setCars] = useState(null);
  const [offers, setOffers] = useState(null);
  const [admins, setAdmins] = useState(null);
  const [makes, setMakes] = useState(null);
  const [error, setError] = useState(null);
  const [feedbacks, setFeedbacks] = useState(null);
  const [language, setLanguage] = useState('en');
  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'ar' : 'en'));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch news
        const newsResponse = await axios.get(`${API_URL}/news`);
        console.log('news: ',newsResponse.data.data)
        setNews(newsResponse.data.data); // Axios automatically parses JSON into .data.data

        // Fetch cars
        const carsResponse = await axios.get(`${API_URL}/cars`);
        setCars(carsResponse.data.data);
        const offersResponse = await axios.get(`${API_URL}/seasonal-offers`);
        setOffers(offersResponse.data.data);
        // Fetch admins
        const adminsResponse = await axios.get(`${API_URL}/admins`);
        console.log('Admins Response:', adminsResponse.data);
        if (Array.isArray(adminsResponse.data.data)) setAdmins(adminsResponse.data.data);
        else throw new Error('Admins data is not an array');

        // Fetch makes
        const makesResponse = await axios.get(`${API_URL}/makes`);
        console.log('Makes Response:', makesResponse.data.data);
        if (Array.isArray(makesResponse.data.data)) setMakes(makesResponse.data.data);
        else throw new Error('Makes data is not an array');

        // Fetch feedbacks
        const feedbacksResponse = await axios.get(`${API_URL}/feedback`);
        console.log('Feedbacks Response:', feedbacksResponse.data.data);
        if (Array.isArray(feedbacksResponse.data.data)) setFeedbacks(feedbacksResponse.data.data);
        else throw new Error('Feedbacks data is not an array');
      } catch (error) {
        console.error('Error fetching data with Axios:', error.message);
      }
    };

    fetchData();
  }, []);

  // Log data for debugging
  useEffect(() => {
    console.log('news:', news);
    console.log('cars:', cars);
  }, [news, cars]);

  // Styles (same as before)
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  };

  const sectionTitleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '40px 0 20px',
    color: 'white',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.2s',
  };

  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  };

  const imageContainerStyle = {
    display: 'flex',
    overflowX: 'auto',
    gap: '10px',
  };
  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
  };

  const carImageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    flexShrink: 0,
  };

  const cardContentStyle = {
    padding: '15px',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#1a73e8',
  };

  const detailsStyle = {
    fontSize: '1rem',
    color: '#555',
    lineHeight: '1.5',
  };

  const dateStyle = {
    fontSize: '0.9rem',
    color: '#888',
    marginTop: '10px',
  };

  // Render loading state or data
  return (
    <div style={containerStyle}>
      {/* News Section */}
      <h1 style={sectionTitleStyle}>Latest News</h1>
      <button onClick={toggleLanguage} style={buttonStyle}>
        Switch to {language === 'en' ? 'Arabic' : 'English'}
      </button>
      {!news ? (
        <p>Loading news...</p>
      ) : (
        <div style={gridStyle}>
          {news.map((newsItem) => (
            <div key={newsItem._id} style={cardStyle}>
              <img src={newsItem.image} alt={newsItem.title[language]} style={imageStyle} />
              <div style={cardContentStyle}>
                <h2 style={titleStyle}>{newsItem.title[language]}</h2>
                <p style={detailsStyle}>{newsItem.details[language]}</p>
                <p style={dateStyle}>
                  {new Date(newsItem.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
  
      {/* Special Offers Section */}
      <div style={containerStyle}>
        <h1 style={sectionTitleStyle}>Special Offers</h1>
        <div style={gridStyle}>
          {offers ? (
            offers.map((offer) => (
              <div key={offer._id} style={cardStyle}>
                <img src={offer.image} alt={offer.title[language]} style={imageStyle} />
                <div style={cardContentStyle}>
                  <h2 style={titleStyle}>{offer.title[language]}</h2>
                  <p style={detailsStyle}>{offer.details[language]}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
  
      {/* Cars Section */}
      <h1 style={sectionTitleStyle}>Available Cars</h1>
      {!cars ? (
        <p>Loading cars...</p>
      ) : (
        <div style={gridStyle}>
          {cars.map((car) => (
            <div key={car._id} style={cardStyle}>
              <div style={imageContainerStyle}>
                {car.images.map((img, index) => (
                  <img key={index} src={img} alt={`${car.name} - Image ${index + 1}`} style={carImageStyle} />
                ))}
              </div>
              <div style={cardContentStyle}>
                <h2 style={titleStyle}>{car.name}</h2>
                <p style={detailsStyle}>
                  <strong>Make:</strong> {car.make.name} <br />
                  <strong>Model:</strong> {car.model} <br />
                  <strong>Year:</strong> {car.year} <br />
                  <strong>Condition:</strong> {car.condition} <br />
                  <strong>Mileage:</strong> {car.mileage.toLocaleString()} km <br />
                  <strong>Stock Number:</strong> {car.stockNumber} <br />
                  <strong>Exterior Color:</strong> {car.exteriorColor} <br />
                  <strong>Interior Color:</strong> {car.interiorColor} <br />
                  <strong>Engine:</strong> {car.engine} <br />
                  <strong>BHP:</strong> {car.bhp} <br />
                  <strong>Doors:</strong> {car.door} <br />
                  <strong>Warranty:</strong> {car.warranty ? 'Yes' : 'No'} <br />
                  <strong>Price:</strong> ${car.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
  
      {/* Admins Section */}
      <h1 style={sectionTitleStyle}>Admins</h1>
      {!admins && !error ? (
        <p>Loading admins...</p>
      ) : admins && admins.length > 0 ? (
        <div style={gridStyle}>
          {admins.map((admin, index) => (
            <div key={index} style={cardStyle}>
              <h2 style={titleStyle}>{admin.name}</h2>
              <p style={detailsStyle}>
                <strong>Mobile:</strong> {admin.mobile} <br />
                <strong>Email:</strong> {admin.email}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No admins available.</p>
      )}
  
      {/* Car Makes Section */}
      <h1 style={sectionTitleStyle}>Car Makes</h1>
      {!makes && !error ? (
        <p>Loading makes...</p>
      ) : makes && makes.length > 0 ? (
        <div style={gridStyle}>
          {makes.map((make, index) => (
            <div key={index} style={cardStyle}>
              <h2 style={titleStyle}>{make.name}</h2>
              <p style={detailsStyle}>
                <strong>Models:</strong> {make.models.join(', ')}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No makes available.</p>
      )}
  
      {/* Feedbacks Section */}
      <h1 style={sectionTitleStyle}>Feedbacks</h1>
      {!feedbacks && !error ? (
        <p>Loading feedbacks...</p>
      ) : feedbacks && feedbacks.length > 0 ? (
        <div style={gridStyle}>
          {feedbacks.map((feedback, index) => (
            <div key={index} style={cardStyle}>
              <h2 style={titleStyle}>{feedback.fullName}</h2>
              <p style={detailsStyle}>
                <strong>Mobile:</strong> {feedback.mobileNumber} <br />
                <strong>Email:</strong> {feedback.email} <br />
                <strong>Message:</strong> {feedback.message}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No feedbacks available.</p>
      )}
    </div>
  );

}
export default App