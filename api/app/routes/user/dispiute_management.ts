import * as express from "express";
import { UserAuthValidator } from "../../middleware/user_validator";
import { raiseBookingDispute } from "../../controller/user/dispute_replay/create_dispute";
import { replyToDispute } from "../../controller/user/dispute_replay/repaly_dispute";

const replayUserRouter = express.Router();
replayUserRouter.post("/create_dispute", UserAuthValidator, raiseBookingDispute);
replayUserRouter.post("/replay_dispute", UserAuthValidator, replyToDispute);

export default replayUserRouter;
