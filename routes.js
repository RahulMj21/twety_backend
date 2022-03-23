const router = require("express").Router();
const AuthController = require("./controllers/AuthController");
const UserController = require("./controllers/UserController");
const deserializeUser = require("./middlewares/deserializeUser");

// auth routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("logout", deserializeUser, AuthController.logout);

// user routes
router.get("/users", deserializeUser, UserController.getAllUsers);
router.get("/user/:id", deserializeUser, UserController.getSingleUser);
router.get("/me", deserializeUser, UserController.getCurrentUser);
router.get("/forgotpassword", UserController.forgotPassword);
router.put("/updateprofile", deserializeUser, UserController.updateProfile);
router.put("/updatepassword", deserializeUser, UserController.updatePassword);
router.put("/resetpassword/:token", UserController.resetPassword);
router.delete("/deleteuser", deserializeUser, UserController.deleteUser);
