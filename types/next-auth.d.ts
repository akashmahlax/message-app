import { User } from "next-auth";

declare module "next-auth" {
    interface User extends User {
        _id: string;
        username: string;
        email: string;
        isverified: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id: string;
        username: string;
        email: string;
        isverified: boolean;
    }
}

declare module "next-auth/next" {
    interface Session {
        user: User;
    }
}
