import express from "express";
import userRouter from "../controllers/users.controller.js";
import agencyRouter from "../controllers/agency.controller.js";

const apiRouter = express();

/// User Routes

apiRouter.use("/users", userRouter);
apiRouter.use("/agencies", agencyRouter);

export default apiRouter;
