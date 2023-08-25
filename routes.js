import express from "express";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { stationController } from "./controllers/station-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { readingController } from "./controllers/reading-controller.js";

export const router = express.Router();

router.get("/", accountsController.index);

router.get("/login", accountsController.login);
router.get("/signup", accountsController.signup);
router.get("/logout", accountsController.logout);
router.get("/editaccount", accountsController.editDetails);
router.post("/register", accountsController.register);
router.post("/authenticate", accountsController.authenticate);
router.post("/update", accountsController.update);


router.get("/dashboard", dashboardController.index);
router.post("/dashboard/addStation", dashboardController.addStation);
router.get("/dashboard/deleteStation/:id", dashboardController.deleteStation);
router.get("/station/:id", stationController.index);
router.post("/station/:id/addReading", stationController.addReading);
router.get("/station/:station_id/deleteReading/:id", stationController.deleteReading);
router.get("/station/:station_id/editReading/:id", readingController.index);
router.post("/station/:station_id/updateReading/:id", readingController.update);

router.get("/about", aboutController.index);
router.get("/logout", accountsController.logout);