import { authModel } from "../model/auth.js";
import jwt from "jsonwebtoken";
import {
  logInValidationSchema,
  regiterValidationSchema,
} from "../validations/auth.js";

const createToken = (payLoad) => {
  const token = jwt.sign({ payLoad }, process.env.SECRET_KEY, {
    expiresIn: "175d",
  });
  return token;
};

export const signIn = async (req, res) => {
  try {
    const { error, value } = logInValidationSchema.validate(req.body);

    if (error) {
      throw new Error(error.details[0].message);
    }
    const { email, password } = req.body;
    // checking email already exist
    const emailExist = await authModel.findOne({
      email: email,
    });

    if (!emailExist) {
      throw new Error("user does not exist with this email");
    }
    // Compare passwords
    const isMatch = await emailExist.comparePassword(password);
    if (!isMatch) {
      throw new Error("password does not match");
    }
    const token = createToken({ _id: emailExist._id });
    res.send({
      message: "successfully logIn",
      token,
      data: emailExist,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const signUp = async (req, res) => {
  try {
    const { error, value } = regiterValidationSchema.validate(req.body);

    if (error) {
      throw new Error(error.details[0].message);
    }

    // checking email already exist
    const userExist = await authModel.findOne({
      email: req.body.email,
    });

    if (userExist) {
      throw new Error("user already exist with this email");
    }

    // create new user
    const newUser = new authModel(req.body);
    const saveUser = await newUser.save();
    const token = createToken({ _id: saveUser._id });
    res.send({
      message: "successfully register",
      token,
      data: saveUser,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const updateUserTags = async (req, res) => {
  try {
    const userId = req.params.userId;
    const newTag = req.query.query;

    const updatedUser = await authModel.findByIdAndUpdate(
      userId,
      { $push: { tags: newTag } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(200).send({ message: "no logedIn user" });
    }

    res.status(200).send({
      message:'added to the tags'
    });
  } catch (error) {
    console.error("Error updating user tags:", error);
    res.status(400).send({ message: error.message });
  }
};
