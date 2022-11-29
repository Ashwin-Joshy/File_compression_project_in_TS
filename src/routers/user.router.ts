import express from "express";
import { Request, Response } from "express";
import UserController from "../controllers/userController";

class UserRouter {
  path = "/users";
  router = express.Router();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get("/", UserController.getAllUsers);
  }
  
}
export default UserRouter;
