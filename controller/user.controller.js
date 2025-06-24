const AddProject = require("../models/addproject.model");
const ChatUser = require("../models/chatUser.modal");
const Test = require("../models/test.model");
const User = require("../models/user.model");
const { setUser, getUser } = require("../services/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // relative path without slash
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});
// Image file filter
const imageFileFilter = function (req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};
const upload = multer({ storage: storage, fileFilter: imageFileFilter });

function isValidEmail(email) {
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function userCreate(req, res) {
  const { name, email, address, skills, language, hobbies, password } =
    req.body;
  try {
    if (!isValidEmail(email))
      return res
        .status(200)
        .json({ status: true, message: "Please enter valid email address." });

    const user = await User.findOne({ email: email });
    if (user)
      return res
        .status(200)
        .json({ status: true, message: "Email already registered" });

    const token = await setUser({
      name: name,
      email: email,
      password: password,
    });
    console.log("token", token);
    res.cookie("token", token.toString());

    await User.create({
      name: name,
      email: email,
      address: address,
      skills: skills,
      language: language,
      hobbies: hobbies,
      password: password,
      token: token,
    });

    return res.status(201).json({ status: true, message: "Success " });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email, password: password });
    if (user) {
      const isVerify = await getUser(user.token);
      console.log("isVerify", isVerify);
      return res
        .status(200)
        .json({ status: true, message: "Success", value: user });
    }
    return res
      .status(200)
      .json({ status: false, message: "No user exist.", value: [] });
  } catch (err) {
    return res.status(400).json({ status: true, message: err.message });
  }
}

async function getTest(req, res) {
  try {
    const test = await Test.find({});
    if (test) {
      return res
        .status(200)
        .json({ status: true, message: "Success", value: test });
    }
    return res
      .status(200)
      .json({ status: false, message: "No user exist.", value: [] });
  } catch (err) {
    return res.status(400).json({ status: true, message: err.message });
  }
}
// ======================================================================
async function userCreateUser(req, res) {
  upload.single("profile")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      return res.status(400).json({ message: err.message });
    } else if (err) {
      // Other errors (e.g., from fileFilter)
      return res.status(400).json({ message: err.message });
    }
    // 👇 Parse JSON string from req.body.data
    let parsedData;
    try {
      parsedData = JSON.parse(req.body.data);
    } catch (e) {
      return res.status(200).json({ message: e.message });
    }
    parsedData.profile = {
      filename: req.file.filename,
      size: req.file.size,
      path: req.file.path,
    };

    const { name, email, address, skills, language, hobbies, password } =
      parsedData;

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded or invalid file type" });
    }

    if (!isValidEmail(email))
      return res
        .status(200)
        .json({ status: true, message: "Please enter valid email address." });

    const user = await User.findOne({ email: email });
    if (user) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("File delete error:", err);
      });
      return res
        .status(200)
        .json({ status: true, message: "Email already registered" });
    }
    const token = await setUser({
      name: name,
      email: email,
      password: password,
    });
    console.log("token", token);
    res.cookie("token", token.toString());
    parsedData.token = token
    // parsedData["profile"] = req.file;
    await User.create(parsedData);

    return res.status(200).json({
      status: true,
      message: "Image uploaded successfully",
      value: parsedData,
      file: req.file,
    });
  });
}

async function getLoginApi(req, res) {
  try {
    const email = req.params.email;
    console.log(req.params.email);
    const user = await User.findOne({ email: email });
    const project = await AddProject.findOne({ email: email });

    // console.log(user);
    console.log(project);

    if (user) {
      if (project) {
        user.project = project.project;
      }
      return res
        .status(200)
        .json({ status: true, message: "Success", value: user });
    }
    return res
      .status(200)
      .json({ status: false, message: "No user exist.", value: [] });
  } catch (err) {
    return res.status(400).json({ status: true, message: err.message });
  }
}

async function addProject(req, res) {
  upload.array("images", 10)(req, res, async function (err) {
    if (err) {
      return res
        .status(500)
        .json({ status: false, message: "error " + err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "No files uploaded" });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(req.body.data);
    } catch (e) {
      return res.status(200).json({ message: "Invalid JSON in data field" });
    }

    // Issue 4: If `parsedData.project` is undefined or not an array
    if (!Array.isArray(parsedData.project)) {
      return res
        .status(400)
        .json({ status: false, message: "project field must be an array" });
    }
    const user = await User.findOne({ email: parsedData.email });
    if (!user) {
      return res.status(200).json({
        status: false,
        message: "User does not exist.",
      });
    }
    const project = await AddProject.findOne({ email: parsedData.email });

    if (project) {
      return res.status(200).json({
        status: false,
        message: "Data already exist in the database.",
      });
    }
    const data = parsedData.project.map((item, index) => {
      if (req.files.length > index) {
        const file = req.files[index];
        return {
          ...item,
          image: {
            originalName: file.originalname,
            filename: file.filename,
            path: file.path,
          },
        };
      } else {
        return item;
      }
    });

    const modifyData = { email: parsedData.email, project: data };

    try {
      await AddProject.create(modifyData);
    } catch (err) {
      console.error("DB Save Error:", err);
      return res
        .status(500)
        .json({ status: false, message: "DB Error", error: err });
    }

    return res.status(200).json({
      status: true,
      message: "Images uploaded successfully!",
      value: modifyData,
    });
  });
}

async function onUserCreate(req, res) {
  const { mobile } = req.body;

  console.log(req.body.mobile);
  const user = await ChatUser.findOne({ mobile: mobile });

  if (user) {
    return res.status(200).json({
      status: true,
      message: "mobile no is already exist",
      value: user,
    });
  }

  await ChatUser.create({ mobile: mobile });
  const users = await ChatUser.findOne({ mobile: mobile });

  return res.status(200).json({
    status: true,
    message: "success",
    value: users,
  });
}

async function getChatUsers(req, res) {
  try {
    const users = await ChatUser.find({});
    if (users) {
      return res
        .status(200)
        .json({ status: true, message: "Success", value: users });
    }
    return res
      .status(200)
      .json({ status: false, message: "No user exist.", value: [] });
  } catch (err) {
    return res.status(400).json({ status: true, message: err.message });
  }
}

module.exports = {
  userCreate,
  getLogin,
  getTest,
  userCreateUser,
  getLoginApi,
  addProject,
  onUserCreate,
  getChatUsers,
};
