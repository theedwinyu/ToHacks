const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const path = require("path");

const utils = require("./utils.js");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

var server = http.createServer(app);
var io = require("socket.io")(server);

const uri = process.env.ATLAS_URI;
mongoose.connect(process.env.MONGODB_URI || uri, {
  dbName: "ToDB",
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const restaurantRouter = require("./routes/graduations");
app.use("/graduations", restaurantRouter);

var allRooms = [];

io.on("connection", (socket) => {
  socket.on("chat", (roomId, name, message) => {
    console.log(`${name} sent comment to ${roomId}: ${message}`);
    if (!utils.hasProfanity(message)) {
      utils.checkSentiment(message).then((result) => {
        if (result.score >= 0) {
          io.to(roomId).emit("newMessage", name, message);
        }
      });
    }
  });

  socket.on("joinRoom", (roomId, name, email, isNewRoom, universityName, classOf) => {
    console.log(JSON.stringify(allRooms));

    if (isNewRoom) {
      console.log(`${name}(${email}) created room: ${roomId}`);
      allRooms = [
        ...allRooms,
        {
          roomId,
          participants: [],
          index: 0,
          universityName,
          classOf,
        },
      ];
    } else {
      console.log(`${name}(${email}) joined room: ${roomId}`);

      let room = allRooms.find((room) => room.roomId === roomId);
      console.log(`found room ${room}`);

      room.participants = [
        ...room.participants,
        {
          name,
          email,
        },
      ];
    }

    io.to(roomId).emit("newMessage", name, `${name} has joined!`);
    console.log(JSON.stringify(allRooms));
    socket.join(roomId);
  });

  socket.on("processPerson", (roomId) => {
    const room = allRooms.find((room) => room.roomId === roomId);

    const currentIndex = room.index;

    if (currentIndex == room.participants.length) {
      const conclusionMessage = `Once again, Congraduations to everyone in this room! You made it!`;
      utils.getTTS(conclusionMessage).then((audio) => {
        io.to(roomId).emit("tts", audio);
        io.to(roomId).emit("done");

        utils.sendEmails(room.participants.map((x) => x.email));
      });
    } else {
      const currentStudent = room.participants[currentIndex];

      const processStudentMessage = `${currentStudent.name} please wave to the audience.`;
      utils.getTTS(processStudentMessage).then((audio) => {
        io.to(roomId).emit("tts", audio);
        io.to(roomId).emit("processPersonName", currentStudent.name);

        room.index += 1;
      });
    }

    console.log("processed");
  });

  socket.on("getDiploma", (roomId) => {
    io.to(roomId).emit("playCheer");
  });

  socket.on("sendVideoFrames", (roomId, image64) => {
    io.to(roomId).emit("shareVideo", image64);
  });

  socket.on("startGraduation", (roomId, universityName, classOf) => {
    const message = `Good morning class of ${classOf}. It is my very great pleasure to welcome you all to ${universityName}'s virtual commencement. 
    Congratulations. Today is a day to acknowledge and celebrate your unwavering commitment to advance the causes and the knowledge that matter most in this time and to you.`
    
    utils.getTTS(message).then((audio) => {
      io.to(roomId).emit("tts", audio);
    });
  })

  socket.on("ttsreq", (roomId, msg) => {
    utils.getTTS(msg).then((audio) => {
      io.to(roomId).emit("tts", audio);
    });
  });
});

app.get("/api/googleTTS", function (req, res) {
  const text = req.param("text");
  console.log(text);

  utils.getTTS(text).then((audio) => {
    console.log(audio);
    res.send("here is your audio");
  });
});

app.get("/api/googleLanguage", function (req, res) {
  const text = req.param("text");
  console.log(text);

  const containsProfanity = utils.hasProfanity(text);
  console.log(containsProfanity);

  utils.checkSentiment(text).then((sentiment) => {
    console.log(sentiment);
    res.send(sentiment);
  });
});

app.get("/api/send_email", function (req, res) {
  // const email = req.param('email');
  const email = "edwin.j.yu@gmail.com";

  utils.sendEmails([email]);
  res.send(`sent email to ${email}`);
});

server.listen(port, () => {
  console.log("Server is running on port: " + port);
});
