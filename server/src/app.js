import express from "express";
import dns from "dns"
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import varifyRoute from "./routes/verification.route.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

app.use(express.json())
app.use(cookieParser())


// auth route
app.use("/api/auth" , authRoute)
//verify route
app.use("/api/verify" , varifyRoute)

export default app;