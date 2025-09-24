import * as express from "express";
import { UserAuthValidator } from "../../middleware/user_validator";
import { listReviews } from "../../controller/user/review/list";
import { createUserReview } from "../../controller/user/review/create";

const reviewRouter = express.Router();

reviewRouter.get("/list/:page",UserAuthValidator,listReviews);
reviewRouter.post("/create",UserAuthValidator,createUserReview);

export default reviewRouter;
