import asyncHandler from "express-async-handler";
import User, { UserType } from "../models/User";
import { tokenize } from "../utils/jwt";
import { createIdentity } from "../utils/did";
import { Request, Response } from "express";

/*
 *  @desc    Route to create the DID for the organisation during the initial setup
 *  @route   POST /api/users/identity
 *  @access  public
 */

const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, password, pin }: any = req.body;

  // try to find a user with the username
  const userExists = await User.findOne({ username });

  // proceed with creation if the username is avalaible
  if (!userExists) {
    try {
      const { messageId }: any = await createIdentity();

      const user: UserType = await User.create({
        username,
        password,
        pin,
      });

      const token: string = tokenize(user._id);

      res.status(201);
      res.json({ id: user._id, username: user.username, token });
    } catch (error) {
      res.status(400);
      console.log(error);
      throw new Error("Bad request");
    }
  } else {
    // raise bad request and throw error if user already exists
    res.status(400);
    throw new Error("User already exists");
  }
});

/*
 *  @desc    Login with pin
 *  @route   POST /api/users/login_with_pin
 *  @access  public
 */

const loginWithPin = asyncHandler(async (req, res) => {
  try {
    const { username, pin }: any = req.body;
    const user: any = await User.findOne({ username });

    if (user) {
      if (await user.matchPin(pin)) {
        const token = tokenize(user._id);
        res.json({ id: user._id, username: user.username, token });
      } else {
        res.status(403);
        throw new Error("Incorrect Pin");
      }
    } else {
      res.status(404);
      throw new Error(`User ${username} not found`);
    }
  } catch (error) {
    throw new Error(error);
  }
});

/*
 *  @desc    Login with password
 *  @route   POST /api/users/login_with_password
 *  @access  public
 */

const loginWithPassword = asyncHandler(async (req, res) => {
  try {
    const { username, password }: any = req.body;
    const user: any = await User.findOne({ username });

    if (user) {
      if (await user.matchPassword(password)) {
        const token = tokenize(user._id);
        res.json({ id: user._id, username: user.username, token });
      } else {
        res.status(403);
        throw new Error("Incorrect Password");
      }
    } else {
      res.status(404);
      throw new Error(`User ${username} not found`);
    }
  } catch (error) {
    throw new Error(error);
  }
});

export { createUser, loginWithPin, loginWithPassword };
