import React from 'react';

const BoxList = ({ boxes, deleteBox }) => {
  return (
    <div className="box-container">
      {boxes.map((box, index) => (
        <div className="custom-box border w-25 h-25" key={index}>
          <div>{box.text}</div>
          <button onClick={() => deleteBox(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default BoxList;