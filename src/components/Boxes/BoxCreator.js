import BoxForm from './BoxForm';
import BoxList from './BoxList';
import React, { useState } from 'react';

const BoxCreator = () => {
    const [boxes, setBoxes] = useState([]);
  
    const createBox = (text) => {
      setBoxes([...boxes, { text }]);
    };
  
    const deleteBox = (index) => {
      const newBoxes = [...boxes];
      newBoxes.splice(index, 1);
      setBoxes(newBoxes);
    };
  
    return (
      <div className="container">
        <BoxForm createBox={createBox} />
        <BoxList boxes={boxes} deleteBox={deleteBox} />
      </div>
    );
  };

export default BoxCreator;