import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["https://chat-list-lake.vercel.app"],
    },
});

const userSocketMap = {}; 

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("✅ A user Connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); 
    }

    socket.on("sendMessage", (message) => {
        const receiverSocketId = getReceiverSocketId(message.receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", message);
        }

        socket.emit("messageSent", message);
    });

    socket.on("markMessagesAsSeen", ({ senderId }) => {
        const senderSocketId = getReceiverSocketId(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("messagesSeen", {
                by: userId,  
            });
        }
    });

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        console.log("❌ Disconnected:", socket.id);
    });
});

export { io, app, server };
