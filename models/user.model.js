const mongoose = require("mongoose");
const bcrypt = require("bcrypt.js");
const crypto = require("crypto");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      public_id: {
        type: String,
        default: "",
      },
      secure_url: {
        type: String,
        default: "",
      },
    },
    role: {
      type: String,
      default: "user",
    },
    forgotPasswordToken: {
      type: String,
      default: "",
    },
    forgotPasswordHash: {
      type: String,
      default: "",
    },
    forgotPasswordExpiry: {
      type: Number,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.getForgotPasswordToken = async function () {
  const randomString = crypto.randomBytes(20).toString("hex");
  const expiry = Date.now() + 1000 * 60 * 10;
  const hash = crypto
    .createHmac("sha256", process.env.FORGOT_PASSWORD_HASH_SECRET)
    .update(`${randomString}.${expiry}`)
    .digest("hex");

  this.forgotPasswordToken = randomString;
  this.forgotPasswordHash = hash;
  this.forgotPasswordExpiry = expiry;

  this.save();

  return randomString;
};

module.exports = mongoose.model("User", userSchema);
