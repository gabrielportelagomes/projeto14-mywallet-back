import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { signUpSchema } from "../models/signUpModel.js";
import { usersCollection, sessionsCollection } from "../database/db.js";

export async function postSignUp(req, res) {
  const user = req.body;

  try {
    const registeredUser = await usersCollection.findOne({ email: user.email });
    if (registeredUser) {
      return res.status(409).send({ message: "E-mail já cadastrado!" });
    }

    const { error } = signUpSchema.validate(user, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return res.status(400).send(errorDetails);
    }

    const hashPassword = bcrypt.hashSync(user.password, 12);
    await usersCollection.insertOne({ ...user, password: hashPassword });
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function postSignIn(req, res) {
  const { email, password } = req.body;

  const token = uuidV4();

  try {
    const registeredUser = await usersCollection.findOne({ email });

    if (!registeredUser) {
      return res.status(401).send({ message: "E-mail não cadastrado!" });
    }

    const passwordCheck = bcrypt.compareSync(password, registeredUser.password);

    if (!passwordCheck) {
      return res.sendStatus(401);
    }

    await sessionsCollection.insertOne({
      token,
      userId: registeredUser._id,
    });

    res.send({ token });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getUser(req, res) {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const session = await sessionsCollection.findOne({ token });
    const user = await usersCollection.findOne({ _id: session.userId });
    delete user.password;

    res.send(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function deleteSignOut(req, res) {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    await sessionsCollection.deleteOne({ token });

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
