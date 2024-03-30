import React, { useState } from 'react';
import { hello_backend } from 'declarations/hello_backend';

const NewEntryModal = ({ isOpen, onClose }) => {
  const [photoUrl, setPhotoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [priceOrange, setPriceOrange] = useState('');
  const [priceGreen, setPriceGreen] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitEntry({ photoUrl, description, priceOrange, priceGreen });
    if (result) {
      onClose(); // Close modal if entry is successful
    } else {
      setErrorMessage('Failed to record entry. Please try again.');
    }
  };

  const submitEntry = async ({  photoUrl, description, priceOrange, priceGreen }) => {
    try {
      console.log('Submitting entry:', { photoUrl, description, priceOrange, priceGreen });
      // Simulate a network request
      var offernr = await hello_backend.announceOffer(
          [photoUrl], description, BigInt(priceOrange), BigInt(priceGreen));
      // Assume the request succeeds; return true for success or false for failure
      return true;
    } catch (error) {
      console.error('Submission failed:', error);
      return false;
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeButton}>X</button>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Photo URL:</label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Price in Orange:</label>
            <input
              type="number"
              value={priceOrange}
              onChange={(e) => setPriceOrange(e.target.value)}
              required
              style={{ color: 'orange' }}
            />
          </div>
          <div>
            <label>Price in Green:</label>
            <input
              type="number"
              value={priceGreen}
              onChange={(e) => setPriceGreen(e.target.value)}
              required
              style={{ color: 'green' }}
            />
          </div>
          <button type="submit">Record Entry</button>
        </form>
        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '500px',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
  errorMessage: {
    color: 'red',
  },
};

export default NewEntryModal;
