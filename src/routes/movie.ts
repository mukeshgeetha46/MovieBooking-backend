import express from "express";
import MovieController from "../controllers/movie";

const router = express.Router();

// Auth Routes
router.get("/allmovies", MovieController.FetchAllmovie);
router.get("/movies/:movie_id", MovieController.FetchmovieDetails);
router.get("/theaters", MovieController.FetchTheaters);
router.get("/theaters/:theater_id", MovieController.FetchTheaterSeats);


export default router;