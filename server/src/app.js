import express from "express";
import dns from "dns"
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

app.use(express.json())
app.use(cookieParser())


// auth route
app.use("/api/auth" , authRoute)

export default app;