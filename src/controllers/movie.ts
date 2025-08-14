import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../database/db";
import httpstatus from "../utils/httpstatus";
import validator from "../utils/validator";




interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    otp?: string;
    otp_verified?: boolean;
    is_active?: boolean;
    [key: string]: any;
}

class MovieController {
    public FetchAllmovie = async (req: Request, res: Response): Promise<void> => {
        try {
           const fetchAllmoives = await db('movies').select('*');

            httpstatus.successResponse(fetchAllmoives, res);
        } catch (e) {
            console.error(e);
            
        }
    };

    

}

export default new MovieController();