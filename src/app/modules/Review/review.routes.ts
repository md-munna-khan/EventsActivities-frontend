

import express from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";



const router = express.Router();

// router.get("/all-reviews", ReviewController.allReviews);
// src/app/modules/Events/event.routes.ts
router.post("/:id/reviews",
     auth(UserRole.CLIENT),
      ReviewController.createReview);
router.get("/:id/reviews",
     ReviewController.listHostReviews);
// src/app/modules/Host/host.routes.ts or general host endpoints
// router.get("/:hostId/reviews", ReviewController.listHostReviews);

export const ReviewRoutes = router;