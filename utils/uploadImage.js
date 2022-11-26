import { cloudinary } from "./cloudinary.js";

async function uploadImage(req, isToUpdate = false, model, field) {
  let imageObject = "";
  
  // update or upload image to cloudinary
  if(req.file) {
    if(isToUpdate) {
      // remove image from cloudinary if this exits
      const public_id = model[field].public_id;
      if(public_id) await cloudinary.uploader.destroy(public_id);
    }
    // upload new image
    imageObject = await cloudinary.uploader.upload(req.file.path);
  }

  const image = imageObject
    ? {
      public_id: imageObject.public_id,
      url: imageObject.secure_url
    }
    : undefined

  return { image, imageObject };
}

export default uploadImage;
