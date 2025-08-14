import express from "express";
import MovieController from "../controllers/movie";

const router = express.Router();

// Auth Routes
router.get("/allmovies", MovieController.FetchAllmovie);


export default router;