import React from 'react';

function Loader() {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Syncing with library API...</p>
    </div>
  );
}

export default Loader;
