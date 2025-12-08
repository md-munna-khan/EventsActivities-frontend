import express   from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { eventsController } from "./event.controller";




const router = express.Router();


 


// Participant: join / leave
router.post("/:id/join", auth(UserRole.CLIENT), eventsController.joinEvent);
router.post("/:id/leave", auth(UserRole.CLIENT), eventsController.leaveEvent);
router.get("/my-bookings", auth(UserRole.CLIENT), eventsController.getMyBookings);



export const eventsRoutes = router;
