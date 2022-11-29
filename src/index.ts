import App from "./app";
import UserRouter from "./routers/user.router";

const app = new App([new UserRouter()]);

app.listen();
