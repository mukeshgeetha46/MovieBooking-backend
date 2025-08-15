import express from "express";
import MovieController from "../controllers/movie";
import multer from "multer";
import { auth } from "../middlewares/jwtauth";

const upload = multer();
const router = express.Router();

// Auth Routes
router.get("/allmovies", MovieController.FetchAllmovie);
router.get("/movies/:movie_id", MovieController.FetchmovieDetails);
router.get("/theaters", MovieController.FetchTheaters);
router.get("/movies/name/:movie_id", MovieController.FetchMovie);
router.get("/movies/booking/list",auth, MovieController.FetchBookingList);
router.get("/theaters/:theater_id/:movie_id", MovieController.FetchTheaterSeats);
router.post("/movies/book",upload.none(), MovieController.BooktTickes);


export default router;