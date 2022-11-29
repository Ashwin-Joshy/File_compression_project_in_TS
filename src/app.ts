import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import helmet from "helmet";
import ErrorMiddleware from "./middlewares/error.middleware";
import { Router } from "./utils/interfaces/router.interface";
import * as http from "http";
import { Server, Socket } from "socket.io";
import IoSocket from "./routers/io.router"; 
import UserRouter from "./routers/user.router";
class App {
  public express: express.Application;
  private port: number = Number(process.env.PORT) || 3000;
  public httpServer: http.Server;
  constructor(Routers: Router[]) {
    this.express = express();
    this.httpServer=http.createServer(this.express);
    this.initMiddlewares();
    this.setSocket();
    this.initRouters(Routers);
    this.initErrorHandling();
  }
  private initMiddlewares(): void {
    this.express.use(express.json());
    this.express.use(helmet());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(express.static("public"));
    this.express.use(cors());
    this.express.use(express.json());
  }
  private initRouters(Routers: Router[]): void {
    Routers.forEach((Router: Router) => {
      this.express.use("/", Router.router);
      
    });

   // this.express.use("/users", new UserRouter().router);
  }
  private initErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }
  private setSocket(): void {
    // let server=http.createServer(this.express);
    // const io = require("socket.io")(server);
   
    // });
    
    const io = new Server(this.httpServer, {
      cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
      },
    });
   
    const ioSocket = new IoSocket(io);
    //  io.on("connection", (socket: Socket) => {
    //   console.log("a user connected");
    //   socket.on("disconnect", () => {
    //     console.log("user disconnected");
    //   });
    // });
  }
  public listen(): void {
    this.httpServer.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
    
  }
}
export default App;
