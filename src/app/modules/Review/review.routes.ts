

import express from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";



const router = express.Router();


router.post("/:id/reviews",
     auth(UserRole.CLIENT),
      ReviewController.createReview);
router.get("/:id/reviews",
     ReviewController.listHostReviews);


export const ReviewRoutes = router;