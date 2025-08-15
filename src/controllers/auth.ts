import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../database/db";
import httpstatus from "../utils/httpstatus";
import validator from "../utils/validator";
import { ChildProcess } from "child_process";




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

class AuthController {
    public register = async (req: Request, res: Response): Promise<void> => {
        console.log('sadhgbvasdhj')
        try {
          const rules = {
    fullname: 'required|string',
    email: 'required|email',
    passwordhash: 'required|string|min:6|max:8',
    confirm_password: 'required|string|same:passwordhash',
};

if (validator.validate(req, res, rules)) return;


            const data = req.body;

            const existingUser: User | undefined = await db('users').where({ email: data.email }).first();
            if (existingUser) {
                httpstatus.invalidInputResponse({ error: 'User already exists' }, res);
                return;
            }

            const hashedPassword = await bcrypt.hash(data.passwordhash, 10);
            delete data.confirm_password; // Remove confirm_password from the data to avoid storing it
            await db('users').insert({ ...data, passwordhash: hashedPassword });

            httpstatus.successResponse('User registered successfully', res);
        } catch (e) {
            console.error(e);
          httpstatus.errorResponse({
    code: 404,
    message: 'An error occurred during registration'
}, res);

                   


        }
    };

    

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const rules = {
                email: 'required|email',
                passwordhash: 'required|string',
            };
            
            if (validator.validate(req, res, rules)) return;

            const { email, passwordhash } = req.body;

            const user: User | undefined = await db('users').where({ email }).first();
            if (!user) {
                httpstatus.invalidInputResponse({ type: "invalid", message: 'Invalid credentials' }, res);
                return;
            }
           
            const isMatch = await bcrypt.compare(passwordhash, user.passwordhash);
            if (!isMatch) {
                httpstatus.invalidInputResponse({ type: "invalid", message: 'Invalid credentials' }, res);
                return;
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );

            const { password: _, ...userWithoutPassword } = user;
            httpstatus.successResponse({ 
                message: 'Login successful', 
                token, 
                user: userWithoutPassword 
            }, res);
        } catch (e) {
            console.error(e);
            
        }
    };
}

export default new AuthController();