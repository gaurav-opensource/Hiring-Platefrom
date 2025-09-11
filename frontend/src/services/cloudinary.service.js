import axios from 'axios';

const uploadToCloudinary = (file, type = "image") => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "ml_default");
  data.append("folder", "Healthcare");

  const url =
    type === "image"
      ? "https://api.cloudinary.com/v1_1/dznnyaj0z/image/upload"
      : "https://api.cloudinary.com/v1_1/dznnyaj0z/raw/upload";

  return axios.post(url, data).then((res) => res.data.secure_url);
};


export default uploadToCloudinary;

