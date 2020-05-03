const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const graduationSchema = new Schema(
  {
    creator: { type: String },
    collegeName: { type: String },
    classOf: { type: String, minlength: 4 },
    timeStarted: { type: Date },
    // Date or String
    studentID: { type: [String] },
    diplomaRecieved: { type: [Boolean] },
    // Students, Parents, etc
    whoAreYou: { type: [String] },
    participants: { type: [String] },
    authToken: { type: String },
  },
  {
    timestamps: true,
  }
);

const Graduation = mongoose.model("Graduation", graduationSchema);

module.exports = Graduation;
