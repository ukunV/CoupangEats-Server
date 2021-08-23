const jwtMiddleware = require("../../../config/jwtMiddleware");
const adminProvider = require("../../app/admin/adminProvider");
const adminService = require("../../app/admin/adminService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const secret_config = require("../../../config/secret");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const passport = require("passport");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");
