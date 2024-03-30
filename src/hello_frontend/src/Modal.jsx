import React from 'react';

const ProcessingModal = () => {

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Processing...</h2>
        {/* You can add more details or a spinner here */}
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
    padding: '20px',
    background: 'white',
    borderRadius: '5px',
  },
};

export default ProcessingModal;