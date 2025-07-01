import express from "express";
import userRouter from "../controllers/users.controller.js";
import agencyRouter from "../controllers/agency.controller.js";
import listingRouter from "../controllers/listing.controller.js";
import imageRouter from "../controllers/image.controller.js";

const apiRouter = express();

apiRouter.use("/users", userRouter);
apiRouter.use("/agencies", agencyRouter);
apiRouter.use("/listings", listingRouter);
apiRouter.use("/imgaes", imageRouter);

export default apiRouter;
