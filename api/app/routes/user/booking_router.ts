import * as express from "express";
import { UserAuthValidator } from "../../middleware/user_validator";
import { listBookings } from "../../controller/user/booking/list_bookings";
import { createBooking } from "../../controller/user/booking/create_booking";
import { checkAvailability } from "../../controller/user/booking/check_availability";
import { updateBookingStatus } from "../../controller/user/booking/complete_booking";
import { getBookingById } from "../../controller/user/booking/view_booking";


const bookingUserRouter = express.Router();
bookingUserRouter.get("/list/:page", UserAuthValidator, listBookings);
bookingUserRouter.post("/create_booking", UserAuthValidator, createBooking);
bookingUserRouter.post("/complete_booking", UserAuthValidator, updateBookingStatus);
bookingUserRouter.post("/check_availability", UserAuthValidator, checkAvailability);
bookingUserRouter.get("/view/:id", UserAuthValidator, getBookingById);

export default bookingUserRouter;
