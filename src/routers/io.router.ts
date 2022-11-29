import * as socketio from "socket.io";
import { IncomingSocketData } from "../utils/interfaces/incomingSocketData";
import FileController from "../utils/classes/fileController";
import ValidateInput from "../utils/classes/validateInput";
import { ValidationResponse } from "../utils/interfaces/validationResponse";
class IoSocket {
  constructor(io: any) {
    this.setConnection(io);
  }
  private setConnection(io: any): void {
    io.on("connection", (socket: socketio.Socket) => {
      console.log("a new user connected");
      socket.on("start", async (data: IncomingSocketData) => {
        let fileController = new FileController();
        if (FileController.status != "Idle") {
          socket.emit("chat", "Server Busy, Please try again later");
        } else {
          let result: string = "";
          try {
            console.log("reached");
            let valRes: ValidationResponse = await ValidateInput.validate(data);
            if (valRes.type == "error") {
              console.log("valRes", valRes);
              socket.emit("chat", valRes.message);
            }
            console.log("after valres", valRes);
            let from = data.from;
            let to = data.to;
            for (let i = 0; i < from.length; i++) {
              result = await fileController.archiveFile(
                from[i],
                to[i],
                data.fromdate,
                data.todate,
                data.zipname,
                socket,
                i + 1
              );
            }
          } catch (error: any) {
            result = error.message;
          } finally {
            console.log("Result to send", result);
            socket.emit("chat", result);
          }
        }
      });
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });
  }
}
export default IoSocket;
