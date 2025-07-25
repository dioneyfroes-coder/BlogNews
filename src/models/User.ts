import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  role: string;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
