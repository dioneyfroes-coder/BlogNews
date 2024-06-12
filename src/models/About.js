import mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema({
  title: { type: String, required: false },
  text: { type: String, required: false },
  imageURL: { type: String, required: false },
  phone: { type: String, required: false },
  whatsapp: { type: String, required: false },
  address: { type: String, required: false },
  email: { type: String, required: false },
  socialLinks: { type: [String], required: false },
});

export default mongoose.models.About || mongoose.model('About', AboutSchema);
