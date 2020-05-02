const router = require("express").Router();
let Graduation = require("../models/graduations.model");

router.route("/add").post((req, res) => {
  const collegeName = req.body.collegeName;
  const classOf = req.body.classOf;
  const timeStarted = req.body.timeStarted;
  const authToken = req.body.authToken;

  const newGraduation = new Graduation({
    collegeName,
    classOf,
    timeStarted,
    authToken,
  });

  newGraduation
    .save()
    .then(() => res.json("User added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/updateParticipant").post((req, res) => {
  const whoAreYou = req.body.whoAreYou;
  const timeJoined = Date.parse(req.body.timeJoined);
  const studentID = req.body.studentID;
  const diplomaRecieved = req.body.diplomaRecieved;
  const authToken = req.body.authToken;

  const participant = { whoAreYou, timeJoined, studentID, diplomaRecieved };

  Graduation.find({ authToken: authToken }).then((graduation) => {
    if (user.length === 0) {
      res.json("Room does not exist!!");
    } else {
      graduation[0].participants.push(participant);
      graduation[0]
        .save()
        .then(() => res.json("User updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    }
  })
});

router.route("/").get((req, res) => {
  Graduation.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Exercise.findByIdAndDelete(req.params.id)
    .then(() => res.json("User deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
