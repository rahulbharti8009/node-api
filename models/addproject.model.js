const mongoose = require("mongoose");

const addproject = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    project: {
      type: [
        {
          title: { type: String, default: "" },
          description: { type: String, default: "" },
          technologies: { type: String, default: "" },
          image: {
            type: {
              filename: { type: String, default: "" },
              path: { type: String, default: "" },
              size: { type: String, default: "" },
            },
          },
        },
      ],
    },
  },
  { timestamps: true }
);

const AddProject = mongoose.model("addproject", addproject);

module.exports = AddProject;
