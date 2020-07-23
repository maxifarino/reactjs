/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react';
import Dropzone from 'react-dropzone';
import Placeholder from './../components/placeholder';
import ImagePreview from './../components/imagePreview';

const renderDropzoneInput = (field) => {
  const [files, setFiles] = useState([]);
  
  const handleOnDrop = (acceptedFiles) => {
    field.input.onChange(acceptedFiles)
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
  }
  
  useEffect(() => () => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);
  
  const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };  
  const activeStyle = {
    borderColor: '#2196f3'
  };  
  const acceptStyle = {
    borderColor: '#00e676'
  };  
  const rejectStyle = {
    borderColor: '#ff1744'
  };  

  return (
    <div>
      <Dropzone
        name={field.name}
        onDrop={handleOnDrop}
        accept='application/pdf'
      >
        {({
          getRootProps,
          getInputProps,
          isDragActive,
          isDragAccept,
          isDragReject,
          rejectedFiles,
        }) => {
        
          const style = useMemo(() => ({
            ...baseStyle,
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
            ...((field.meta.error && field.meta.touched) ? rejectStyle : {})
          }), [
            isDragActive,
            isDragReject,
            field
          ]);
          
          return (
            <div {...getRootProps({ style })}>
              <input {...getInputProps()} />
              {files && files.length > 0 ? (
                <ImagePreview files={files} />
              ) : (
                <Placeholder error={field.meta.error} touched={field.meta.touched} />
              )}
            </div>
          );
        }}
      </Dropzone>
    </div>
  );
}

export default renderDropzoneInput;