const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const graduationSchema = new Schema(
  {
    collegeName: { type: String },
    classOf: { type: String, minlength: 4 },
    timeStarted: { type: Date },
    participant: {
      // Date or String
      timeJoined: { type: Date },
      studentID: { type: String },
      diplomaRecieved: { type: Boolean },
      // Students, Parents, etc
      whoAreYou: { type: String },
    },
    participants: { type: [participant] },
    authToken: { type: String },
  },
  {
    timestamps: true,
  }
);

const Graduation = mongoose.model("Graduation", graduationSchema);

module.exports = Graduation;
