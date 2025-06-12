import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import '../../styles/common/ImageUploader.scss';

const ImageUploader = ({
  onUpload,
  multiple = false,
  accept = 'image/*',
  maxSize = 5, // MB
  maxFiles = 5,
  preview = true
}) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [previewUrls, setPreviewUrls] = React.useState([]);
  const [error, setError] = React.useState(null);

  const validateFiles = (files) => {
    const validFiles = Array.from(files).filter(file => {
      // Kiểm tra kích thước
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File ${file.name} vượt quá kích thước cho phép (${maxSize}MB)`);
        return false;
      }
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        setError(`File ${file.name} không phải là hình ảnh`);
        return false;
      }
      return true;
    });

    // Kiểm tra số lượng file
    if (validFiles.length > maxFiles) {
      setError(`Chỉ được upload tối đa ${maxFiles} file`);
      return [];
    }

    return validFiles;
  };

  const handleFiles = useCallback((files) => {
    setError(null);
    const validFiles = validateFiles(files);
    
    if (validFiles.length > 0) {
      if (preview) {
        const urls = validFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...urls]);
      }
      onUpload(multiple ? validFiles : validFiles[0]);
    }
  }, [multiple, maxFiles, maxSize, onUpload, preview]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleChange = useCallback((e) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const removePreview = useCallback((index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="image-uploader">
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="file-input"
        />
        <div className="upload-content">
          <UploadIcon className="upload-icon" />
          <p>Kéo thả hình ảnh vào đây hoặc click để chọn</p>
          <p className="upload-hint">
            {multiple 
              ? `Tối đa ${maxFiles} file, mỗi file không quá ${maxSize}MB`
              : `File không quá ${maxSize}MB`}
          </p>
        </div>
      </div>

      {error && (
        <div className="upload-error">
          {error}
        </div>
      )}

      {preview && previewUrls.length > 0 && (
        <div className="preview-container">
          {previewUrls.map((url, index) => (
            <div key={index} className="preview-item">
              <img src={url} alt={`preview ${index + 1}`} />
              <button
                className="remove-preview"
                onClick={() => removePreview(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ImageUploader.propTypes = {
  onUpload: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  maxSize: PropTypes.number,
  maxFiles: PropTypes.number,
  preview: PropTypes.bool
};

export default ImageUploader; 