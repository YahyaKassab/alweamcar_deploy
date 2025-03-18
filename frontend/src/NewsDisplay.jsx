import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const NewsDisplay = ({ newsItems, language }) => {
  if (!newsItems || newsItems.length === 0) {
    return <p>No news available</p>;
  }

  const containerStyle = {
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
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  };

  const cardContentStyle = {
    padding: '15px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#1a73e8',
  };

  const markdownContainerStyle = {
    fontSize: '1rem',
    color: '#555',
    lineHeight: '1.5',
    flex: 1,
    overflow: 'hidden',
    marginBottom: '15px',
  };

  const dateStyle = {
    fontSize: '0.9rem',
    color: '#888',
    marginTop: 'auto',
  };

  const markdownStyle = {
    // Custom styles for markdown content
    '& h1, & h2, & h3': {
      margin: '10px 0',
      color: '#333',
    },
    '& ul, & ol': {
      paddingLeft: '20px',
    },
    '& img': {
      maxWidth: '100%',
    },
    '& blockquote': {
      borderLeft: '4px solid #ddd',
      paddingLeft: '15px',
      margin: '10px 0',
      color: '#666',
    },
    '& code': {
      backgroundColor: '#f5f5f5',
      padding: '2px 4px',
      borderRadius: '4px',
      fontFamily: 'monospace',
    },
    '& pre': {
      backgroundColor: '#f5f5f5',
      padding: '10px',
      borderRadius: '4px',
      overflow: 'auto',
    },
    '& table': {
      borderCollapse: 'collapse',
      width: '100%',
    },
    '& th, & td': {
      border: '1px solid #ddd',
      padding: '8px',
    }
  };

  return (
    <div style={containerStyle}>
      {newsItems.map((newsItem) => (
        <div key={newsItem._id} style={cardStyle}>
          {newsItem.image && (
            <img src={newsItem.image} alt={newsItem.title[language]} style={imageStyle} />
          )}
          <div style={cardContentStyle}>
            <h2 style={titleStyle}>{newsItem.title[language]}</h2>
            <div style={markdownContainerStyle}>
            <div className="markdown-content">
  <ReactMarkdown
    rehypePlugins={[rehypeRaw]}
    components={{
      img: ({node, ...props}) => (
        <img {...props} style={{maxWidth: '100%'}} alt={props.alt || 'image'} />
      ),
      a: ({node, ...props}) => (
        <a {...props} target="_blank" rel="noopener noreferrer" style={{color: '#1a73e8'}} />
      )
    }}
  >
    {newsItem.details[language]}
  </ReactMarkdown>
</div>
            </div>
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
  );
};

export default NewsDisplay;