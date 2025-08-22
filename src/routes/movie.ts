import express from "express";
import MovieController from "../controllers/movie";
import multer from "multer";
import { auth } from "../middlewares/jwtauth";

const upload = multer();
const router = express.Router();

// Auth Routes
router.get("/allmovies", MovieController.FetchAllmovie);
router.get("/booked/seats/:theater_id", MovieController.FetchBookedSeats);
router.get("/movies/:movie_id", MovieController.FetchmovieDetails);
router.get("/theaters", MovieController.FetchTheaters);
router.get("/movies/name/:movie_id", MovieController.FetchMovie);
router.get("/movies/theater/:theater_id/:movie_id", MovieController.FetchTheaterName);
router.get("/movies/moviedetails/:booking_id", MovieController.FetchBookedDetails);
router.get("/bookings",auth, MovieController.FetchBookingList);
router.get("/slots/:theater_id/:movie_id", MovieController.FetchTheaterSeats);
router.post("/movies/book",upload.none(),auth, MovieController.BooktTickes);
router.post("/add/movie",MovieController.InsertNewMovie);


export default router;