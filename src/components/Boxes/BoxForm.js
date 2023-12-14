import React, { useState } from 'react';

const BoxForm = ({ createBox }) => {
  const [boxText, setBoxText] = useState('');

  const handleInputChange = (e) => {
    setBoxText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createBox(boxText);
    setBoxText('');
  };

  return (
    <div className="box-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter text"
          value={boxText}
          onChange={handleInputChange}
        />
        <button type="submit">Create Box</button>
      </form>
    </div>
  );
};
export default BoxForm;