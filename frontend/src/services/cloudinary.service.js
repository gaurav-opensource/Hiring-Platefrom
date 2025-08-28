import axios from 'axios';


const CLOUD_NAME = 'dznnyaj0z';
const UPLOAD_PRESET = 'ml_default';

// Function to upload file to Cloudinary
const uploadToCloudinary = async (file, type = 'image') => {
  try {
    const data = new FormData();
    data.append('file', file);
    data.append('folder', 'Healthcare');

    const preset = type === 'image' ? 'ml_default' : 'resume_upload';
    data.append('upload_preset', preset);

    const url =
      type === 'image'
        ? 'https://api.cloudinary.com/v1_1/dznnyaj0z/image/upload'
        : 'https://api.cloudinary.com/v1_1/dznnyaj0z/raw/upload';

    const res = await axios.post(url, data);
    return res.data.secure_url;
  } catch (err) {
    console.error('Cloudinary upload failed:', err.response?.data || err);
    throw new Error('File upload failed. Please try again.');
  }
};


export default uploadToCloudinary;

