import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Required CSS

const MyEditor = ({value,  setValue}) => {
  

  return (
    <div className='mb-2'>
      <ReactQuill value={value} onChange={setValue} />
    </div>
  );
};

export default MyEditor;
