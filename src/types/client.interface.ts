import { UserInfo } from "./user.interface";

export type Client = {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber: string;
  address: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: UserInfo; 
};
