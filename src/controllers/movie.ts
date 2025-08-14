import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../database/db";
import httpstatus from "../utils/httpstatus";
import validator from "../utils/validator";

class MovieController {
    public FetchAllmovie = async (req: Request, res: Response): Promise<void> => {
        try {
           const fetchAllmoives = await db('movies').select('*');

            httpstatus.successResponse(fetchAllmoives, res);
        } catch (e) {
            console.error(e);
            
        }
    };
    public FetchmovieDetails = async (req: Request, res: Response): Promise<void> => {
        try {
            const { movie_id } = req.params;
           const fetchmoivesdetails = await db('movies').select('*').where({ movie_id:movie_id }).first();

            httpstatus.successResponse(fetchmoivesdetails, res);
        } catch (e) {
            console.error(e);
            
        }
    };
    public FetchTheaters = async (req: Request, res: Response): Promise<void> => {
        try {
           const fetchtheaters = await db('theaters').select('*');

            httpstatus.successResponse(fetchtheaters, res);
        } catch (e) {
            console.error(e);
            
        }
    };
    public FetchTheaterSeats = async (req: Request, res: Response): Promise<void> => {
        try {
            const { theater_id } = req.params;
           const fetchtheaters = await db('seats').select('*').where({ theater_id:theater_id });

            httpstatus.successResponse(fetchtheaters, res);
        } catch (e) {
            console.error(e);
            
        }
    };


    

}

export default new MovieController();