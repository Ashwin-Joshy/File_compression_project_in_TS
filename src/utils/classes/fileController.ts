import fs from "fs";
const fsp = require("fs").promises;
import archiver from "archiver";
import readline from "readline";
import { Socket } from "socket.io";

class FileController {
  public static status: string = "Idle";
  public static activeArray = [];
  constructor() {}
  public async archiveFile(
    fromPath: string,
    toPath: string,
    fromD: string,
    toD: string,
    zipName: string,
    socket: Socket,
    currentPath: number
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      console.log("here 0");
      FileController.status = "Busy";
      let output: any; // check by loggin the type
      let toDate: any = new Date(toD);
      toDate.setHours(23, 59, 59, 999);
      let fromDate = new Date(fromD);
      fromDate.setHours(0, 0, 0, 0);

      try {
        const files = await fsp.readdir(fromPath);
        await fsp.readdir(toPath);
        console.log("here 1");
        if (files.length == 0) {
          reject("No files found");
        }
        //Step 2 - create a file to stream archive data to

        output = fs.createWriteStream(`${toPath}/${zipName}.zip`);
        const archive = archiver("zip", {
          zlib: { level: 9 },
        });

        //Step 3 - callbacks
        output.on("close", () => {
          console.log("Archive finished.");
          //socket.emit("chat", `Completed`);
          FileController.status = "Idle";
          resolve("Completed");
        });

        archive.on("error", (err) => {
          console.log("throwing error");
          this.handleAsyncError(err, toPath, output, zipName, reject);
        });
        //To return the percent of the file that has been archiving
        archive.on("progress", (progress) => {
          console.log("progress", progress);
          socket.emit(
            "chat",
            `Progress ${progress.entries.processed}/${progress.entries.total}`
          );
        });

        //Step 4 - pipe and append files
        archive.pipe(output);
        let percentage = 0;
        let fileDate;
        let stats;
        for (let i = 0; i < files.length; i++) {
          //await fileController.validateFile(`${fromPath}/${files[i]}`);

          stats = fs.statSync(`${fromPath}/${files[i]}`);

          fileDate = new Date(stats.mtimeMs);
          console.log(i);
          console.log("Less than to date", fileDate < toDate);
          console.log("Greater than from date", fileDate > fromDate);
          console.log("FileDate" + fileDate);
          console.log("FromDate" + fromDate);
          console.log("ToDate" + toDate);
          if (fileDate >= fromDate && fileDate <= toDate) {
            if (stats.isDirectory()) {
              console.log("directory found");
              // append files from a sub-directory and naming it `new-subdir` within the archive
              archive.directory(`${fromPath}/${files[i]}/`, `${files[i]}`);
            } else {
              archive.append(fs.createReadStream(`${fromPath}/${files[i]}`), {
                name: `${files[i]}`,
              });
            }
          }
          percentage = (i / files.length) * 100;
          socket.emit(
            "chat",
            `Processing path ${currentPath} : ${percentage.toFixed(2)}%`
          );
        }

        //Step 5 - finalize
        socket.emit(
          "chat",
          `Compressing file ${currentPath} : This might take a while`
        );
        archive.finalize();
      } catch (error) {
        /*We are passing the error to another function because we want to handle the error 
                     of .on('error',(error)) properly too, if not the error is not caught properly and handled
                     due to try catch scope issues. Other than typng the entire error section again inside .on('error)
                     it is better to write it in another function and call it   */
        this.handleAsyncError(error, toPath, output, zipName, reject);
      }
    });
  }
  private async handleAsyncError(
    error: any,
    toPath: string,
    output: any,
    zipName: string,
    reject: any
  ) {
    console.log("error", error);
    //output.emit('close')
    FileController.status = "Idle";
    if (output == "" || output == undefined) {
      reject(error);
    } else {
      setTimeout(async () => {
        output.end();
        await fsp.rm(`${toPath}/${zipName}.zip`);
      }, 1000);
      reject(error);
    }
  }
}
export default FileController;
