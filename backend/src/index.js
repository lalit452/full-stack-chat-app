// const express = require("express")
import express from "express"
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import messageRoutes from "./routes/message.route.js"
import cors from "cors";

import {connectDB} from './lib/db.js'
import { app, server } from "./lib/socket.js"
dotenv.config()
// const app = express();    // delete because soket.io me app create kar diya hai
// import { app, server } from "./lib/socket.js"  <------ we imported this app from soket.io this will we will use

const PORT = process.env.PORT
// this will allow you to extract json data out of body
app.use(express.json()); 
app.use(cookieParser());
app.use(cors({ 
    // origin: "http://localhost:5173", 
    origin : process.env.FRONTEND_URL,
    credentials: true
}))
 

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.get("/lalit",(req, res)=>{
    res.send("Hello")
})

// app.listen(PORT, ()=>{             <------------- app ko server se replace kar de to use socket.io
server.listen(PORT, ()=>{
    console.log("server is running on PORT :" + PORT);
    connectDB()
}) 