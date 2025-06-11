const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    about: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    nationality: {
      type: String,
      default: "",
    },
    study: {
      type: String,
      default: "",
    },
    interests: {
      type: String,
      default: "",
    },
    employment: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    comments: {
      type: [
        {
          comment: {
            type: String,
            default: "",
          },
          name: {
            type: String,
            default: "",
          },
        },
      ],
    },
    skills: {
      type: [
        {
          name: { type: String, default: "" },
          data: {
            type : [{
                name : {type : String, default : ''}, 
                rating: { type: Number, default: "", min: 1, max: 10 },
            }]
          }
        },
      ],
    },
    education: {
      type: [
        {
          title: {
            type: String,
            default: "",
          },
          college: {
            type: String,
            default: "",
          },
          year: {
            type: String,
            default: "",
          },
          description: {
            type: String,
            default: "",
          },
        },
      ],
    },
    work: {
      type: [
        {
          title: { type: String, default: "" },
          company: {
            type: String,
            default: "",
          },
          year: {
            type: String,
            default: "",
          },
          description: {
            type: String,
            default: "",
          },
        },
      ],
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
    language: {
      type: String,
    },
    hobbies: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    token: { type: String, default: "" },
    role: { type: String, default: "" },
    profile: {
      type: {
        filename: { type: String, default: "" },
        path: { type: String, default: "" },
        size: { type: String, default: "" },
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
