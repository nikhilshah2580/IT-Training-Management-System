import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (path) => {
  try {
    const res = await cloudinary.uploader.upload(path, {
      resource_type: "image",
    });
    return res;
  } catch (error) {
    console.log("Cloudinary Upload Error:", error);
    let message = "Failed to upload file on Cloudinary";
    if (error.code === 'ENOTFOUND' || error.syscall === 'getaddrinfo') {
      message = "Network error: Unable to connect to api.cloudinary.com. Please check your internet connection or DNS settings.";
    }
    let err = new Error(message);
    err.statusCode = 500;
    throw err;
  }
};

export default uploadOnCloudinary;
