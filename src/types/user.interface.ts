import { UserRole } from "../lib/auth-utils";
import { IAdmin } from "./admin.interface";
import { Client } from "./client.interface";


export interface UserInfo {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    needPasswordChange: boolean;
    status: "ACTIVE" | "BLOCKED" | "DELETED";
    admin?: IAdmin;
    client: Client,
    createdAt: string;
    updatedAt: string;
}