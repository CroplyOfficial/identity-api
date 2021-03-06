import asyncHandler from "express-async-handler";
import User, { UserType } from "../models/User";
import { tokenize } from "../utils/authUtils/jwt";
import { Request, Response } from "express";

/*
 *  @desc    Route to create the DID for the organisation during the initial setup
 *  @route   POST /api/users/identity
 *  @access  public
 */

const createUser = asyncHandler(async (req: Request, res: Response) => {
  interface IReqBody {
    username: string;
    password: string;
    pin?: string;
  }
  const { username, password, pin }: IReqBody = req.body;

  // try to find a user with the username
  const userExists = await User.findOne({ username });

  // proceed with creation if the username is avalaible
  if (!userExists) {
    try {
      const user = await User.create({
        username,
        password,
        pin,
      }).catch((error) => {
        console.log(error);
        throw new Error(error);
      });

      const token: string = tokenize(user._id);

      res.status(201);
      res.json({ id: user._id, username: user.username, token });
    } catch (error) {
      res.status(400);
      throw new Error("Bad request");
    }
  } else {
    // raise bad request and throw error if user already exists
    res.status(400);
    throw new Error("User already exists");
  }
});

/**
 * Create a new user with the isStaff flag on, this
 * user type can only be created by staff with the
 * permissions to create a new user in the organisation
 *
 *  @route POST /api/users/staff-user
 *  @returns User
 */

const newStaffUser = asyncHandler(async (req: Request, res: Response) => {
  interface IReqBody {
    username: string;
    password: string;
    pin: string;
  }
  const { username, password, pin }: IReqBody = req.body;
  const staffUser = await User.create({
    username,
    password,
    pin,
    isStaff: true,
  }).catch((error) => {
    res.status(404);
    throw new Error(`Unable to create staff user\n${error}`);
  });
  res.json(staffUser);
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
    throw new Error(error as string);
  }
});

/**
 * Get user information
 *
 * @route GET /api/users/@me
 * @access Bearer Token
 */

const getUserInfo = asyncHandler(async (req, res) => {
  const user = req.user;
  const token = tokenize(user._id);
  res.json({
    user,
    token,
  });
});

/**
 * Assign a did to the user who scans the QR and makes
 * a request to do stuff
 *
 * @route POST /api/users/assign-token
 * @access Bearer token
 */

const assignDID = asyncHandler(async (req, res) => {
  const user = req.user;
  const { did } = req.body;
  if (did) {
    user.did = did;
    const updated = await user.save();
    res.json(updated);
  } else {
    res.status(400);
    throw new Error("did is missing");
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
    throw new Error(error as string);
  }
});

/**
 * get all the staff users and return them
 *
 * @route /api/users/@staff
 * @retunrs {IUser[]};
 */

const getStaffUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({ isStaff: true }).populate("role").exec();
  if (users) {
    res.json(users);
  } else {
    res.status(404);
    throw new Error("users not found");
  }
});

export {
  createUser,
  newStaffUser,
  loginWithPin,
  loginWithPassword,
  getStaffUsers,
  getUserInfo,
  assignDID,
};
