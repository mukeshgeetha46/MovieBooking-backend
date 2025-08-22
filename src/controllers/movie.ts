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
            httpstatus.errorResponse({ 
      code: 500, 
      message: 'Internal server error while fetching movies' 
    }, res);
        }
    };
    public FetchmovieDetails = async (req: Request, res: Response): Promise<void> => {
        try {
            const { movie_id } = req.params;
           const fetchmoivesdetails = await db('movies').select('*').where({ movie_id:movie_id }).first();

            httpstatus.successResponse(fetchmoivesdetails, res);
        } catch (e) {
            console.error(e);
             httpstatus.errorResponse({ 
      code: 500, 
      message: 'internal server error while fetching movie details' 
    }, res);
        }
    };
    public FetchTheaters = async (req: Request, res: Response): Promise<void> => {
        try {
           const fetchtheaters = await db('theaters').select('*');

            httpstatus.successResponse(fetchtheaters, res);
        } catch (e) {
            console.error(e);
             httpstatus.errorResponse({ 
      code: 500, 
      message: 'Internal server error while fetching theaters' 
    }, res);
        }
    };
    public FetchTheaterSeats = async (req: Request, res: Response): Promise<void> => {
        try {
            const { theater_id,movie_id } = req.params;
           const fetchtheaters = await db('seats').select('*').where({ theater_id:theater_id,movie_id:movie_id }).orderBy('seat_id', 'asc');

            httpstatus.successResponse(fetchtheaters, res);
        } catch (e) {
            console.error(e);
             httpstatus.errorResponse({ 
      code: 500, 
      message: 'Internal server error while fetching theater seats' 
    }, res);
        }
    };
    public FetchBookedSeats = async (req: Request, res: Response): Promise<void> => {
        try {
            const { theater_id,movie_id } = req.params;
          const bookedSeats = await db('booked_seat')
  .select(
    'seat_row',
    'seat_type',
    'seat_number',
    db.raw('false as is_active')
  )
  .where({ theater_id: theater_id })
  .orderBy('seat_id','asc')


            httpstatus.successResponse(bookedSeats, res);
        } catch (e) {
            console.error(e);
             httpstatus.errorResponse({ 
      code: 500, 
      message: 'Internal server error while fetching theater seats' 
    }, res);
        }
    };
    public FetchMovie = async (req: Request, res: Response): Promise<void> => {
        try {
            const { movie_id } = req.params;
           const fetchmovie = await db('movies').select('title').where({ movie_id:movie_id }).first();

            httpstatus.successResponse(fetchmovie, res);
        } catch (e) {
            console.error(e);
             httpstatus.errorResponse({ 
      code: 500, 
      message: 'Internal server error while fetching movie name' 
    }, res);
        }
    };
    public FetchTheaterName = async (req: Request, res: Response): Promise<void> => {
        try {
            const { theater_id,movie_id } = req.params;
           const fetchTheater = await db('theaters').select('name').where({ theater_id:theater_id }).first();
           const fetchmovies = await db('movies').select('title').where({ movie_id:movie_id }).first();

           httpstatus.successResponse({
  name: fetchTheater.name,
  movie: fetchmovies.title
}, res);
        } catch (e) {
            console.error(e);
             httpstatus.errorResponse({ 
      code: 500, 
      message: 'Internal server error while fetching theater name' 
    }, res);
        }
    };
    public BooktTickes = async (req: Request, res: Response): Promise<void> => {
        try {
          const { id } = req.user || {};
          const { show_date,price,seats,movie_id } = req.body;
        const theater_id = seats[0].theater_id; 
          await db('booking_status').insert({
            screening_id: 5,
            status:'Booked',
            customer_id: id,
            price: price,
            theater_id:theater_id,
            movie_id:movie_id,
            movie_date:show_date
          });

          const fetchBookedId = await db('booking_status').select('booking_id').where({ customer_id: id, status: 'Booked' }).orderBy('booking_id','desc').first();
          const seatUpdates = seats.map(async (seat: any) => {
            await db('seats').update({
                is_active: false,
            }).where({ seat_id: seat.seat_id });
            await db('booked_seat').insert({
                booking_id: fetchBookedId.booking_id,
                seat_id: seat.seat_id,
                seat_row:seat.row_letter,
                seat_type: seat.seat_type,
                theater_id:seat.theater_id,
                seat_number: seat.seat_number
            })
        });

        await Promise.all(seatUpdates);
         httpstatus.successResponse({booking_id:fetchBookedId.booking_id}, res);
        } catch (e) {
            console.error(e);
           httpstatus.errorResponse({ 
      code: 500, 
      message: 'Something went wrong while booking tickets' 
    }, res);
        }
    };

 public FetchBookingList = async (req: Request, res: Response): Promise<void> => {
        try {
            const { user } = req;
        

           const users = await db('users').select('userid').where({ email: user?.email }).first();
           

           const bookingList = await db('booking_status')
                .join('movies', 'booking_status.movie_id', 'movies.movie_id')
                .join('theaters', 'booking_status.theater_id', 'theaters.theater_id')
                .select('booking_status.*', 'movies.title', 'theaters.name as theater_name','movies.languages','theaters.address',
                    'movies.release_date','movies.show_time','movies.duration_minutes','movies.image_url'
                )
                .where({ customer_id: users.userid }).orderBy('booking_id', 'desc');
             const ftchbookinglist = await Promise.all(
    bookingList.map(async (booking) => {
        const fetchTicketCount = await db('booked_seat')
            .select('booking_id','seat_id','seat_row','seat_number')
            .where({ booking_id: booking?.booking_id });
          const seatString = fetchTicketCount
            .map(seat => `${seat.seat_number}${seat.seat_row}`)
            .join(', ');
              
            const basePrice = parseFloat(booking.price);
        return {
            ...booking,
            ticket_count: fetchTicketCount.length,
            price:  (basePrice + 30).toFixed(2),
            booked_seats: seatString
        };
    })
);

           
               httpstatus.successResponse(ftchbookinglist, res);
        } catch (e) {
            console.error(e);
             httpstatus.errorResponse({ 
      code: 500, 
      message: 'Internal server error while fetching booking list' 
    }, res);
        }
    };
 public FetchBookedDetails = async (req: Request, res: Response): Promise<void> => {
        try {
            const { user } = req;
           const {  booking_id } = req.params;
          

          const bookingList = await db('booking_status')
  .join('movies', 'booking_status.movie_id', 'movies.movie_id')
  .join('theaters', 'booking_status.theater_id', 'theaters.theater_id')
  .select(
    'booking_status.*',
    'movies.title',
    'theaters.name as theater_name',
    'movies.languages',
    'theaters.address',
    'movies.release_date',
    'movies.show_time',
    'movies.duration_minutes',
    'movies.image_url'
  )
  .where({ booking_id });

if (bookingList.length === 0) {
   
    httpstatus.errorResponse({ 
      code: 404, 
      message: 'Booking not found' 
    }, res);
}

const fetchTicketCount = await db('booked_seat')
  .select('booking_id', 'seat_id', 'seat_row', 'seat_number', 'seat_type') // Added seat_type
  .where({ booking_id });

const seatString = fetchTicketCount.map((seat) => {
  return {
    id: seat.seat_row + seat.seat_number, // Combine row and number for unique ID
    row: seat.seat_row,
    number: seat.seat_number,
    type: seat.seat_type, // Default to 'regular' if seat_type is null
    price: seat.seat_type === 'Premium' ? 350 : 200 // Dynamic pricing
  };
});
bookingList[0].ticket_count = fetchTicketCount.length;
bookingList[0].booked_seats = seatString;

httpstatus.successResponse(bookingList[0], res);

        } catch (e) {
            console.error(e);
             httpstatus.errorResponse({ 
      code: 500, 
      message: 'Internal server error while fetching booked details' 
    }, res);
        }
    };
    

     public InsertNewMovie = async (req: Request, res: Response): Promise<void> => {
      try {
        console.log(req.body)
        await db('movies').insert(req.body);
         httpstatus.successResponse('The New Movie Inserted Successfully', res);
      } catch (error) {
         console.log(error)
      }
     }

}

export default new MovieController();