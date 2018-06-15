import {Schema, model, Document, MongooseDocument} from 'mongoose';

const UserSchema = new Schema({
    name: String,
    password: String,
    avatar: String,
    creationDate: Date
});

export const UserDBModel = model<UserModel & Document & MongooseDocument>('User', UserSchema);

export type UserModel = {
    name: string;
    password: string;
    avatar?: string;
    creationDate?: Date;
};

export type UserLoginModel = {
    name: string;
    password: string;
};

export type AuthUserModel = {
    name: string;
    id: string;
    token: string;
    avatar?: string;
};
