
  const express = require('express')
const fileRouter = express.Router()
const {authUser} = require('../middleware/authUser')

const {upload} = require("../middleware/upload.middleware")

const {uploadFile} = require("../Controllers/file.controller");

fileRouter.post("/upload",authUser,upload.single("file"),uploadFile);

module.exports = fileRouter;