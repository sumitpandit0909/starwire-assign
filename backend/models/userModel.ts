import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  Id: string;
  Name: string;
  Email: string;
  Mobile: string;
  PasswordHash: string;
  ProfileImage: string;
  CreatedDate: Date;
  IsActive: boolean;
  followedStars: string[];
  bookmarkedNews: string[];
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    Name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    Email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    Mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    PasswordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    ProfileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    CreatedDate: {
      type: Date,
      default: Date.now,
    },
    IsActive: {
      type: Boolean,
      default: true,
    },
    followedStars: {
      type: [String],
      default: [],
    },
    bookmarkedNews: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret: any) {
        ret.Id = (ret._id || doc._id).toString();
        delete ret.PasswordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual property Id
UserSchema.virtual('Id').get(function () {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});

export const User = mongoose.model<IUser>('User', UserSchema);
