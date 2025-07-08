const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const dbConnect = require("./config/dbConnect");
const userRoute = require("./routes/userRoutes");
const blogRoute = require("./routes/blogRoutes");
const notificationRoute = require("./routes/notificationRoutes");
const cloudinaryConfig = require("./config/cloudinaryConfig");
const { PORT, FRONTEND_URL } = require("./config/dotenv.config");

const app = express();
const port = PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL, 
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true,
    },
});

const connectedUsers = {};

io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    socket.on("register", (userId) => {
        connectedUsers[userId] = socket.id;
        console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
        for (let userId in connectedUsers) {
            if (connectedUsers[userId] === socket.id) {
                delete connectedUsers[userId];
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    });
});

app.io = io;
app.connectedUsers = connectedUsers;

app.use(express.json());

app.use(
    cors({
        origin: FRONTEND_URL,
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.options("*", cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.get("/", (req, res) => {
    res.send("Hello jee Kya hal hai bhai ke!");
});

app.use("/api/v1", userRoute);
app.use("/api/v1", blogRoute);
app.use("/api/v1", notificationRoute);

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    dbConnect();
    cloudinaryConfig();
});
