import { MESSAGE } from "@/models/user"; 
export interface ApiResponce {
    message: string;
    success: boolean;
    isAcceptingMessages?: boolean;
    Message?: Array<MESSAGE>
    
}