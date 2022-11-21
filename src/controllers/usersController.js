import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { signUpSchema } from "../models/signUpModel.js";
import { signInSchema } from "../models/signInModel.js";
import { usersCollection, sessionsCollection } from "../database/db.js";
import { ObjectId } from "mongodb";

export async function postSignUp(req, res) {
  const user = req.body;

  const { error } = signUpSchema.validate(user, { abortEarly: false });

  if (error) {
    const errorDetails = error.details.map((detail) => detail.message);
    return res.status(400).send(errorDetails);
  }

  try {
    const registeredUser = await usersCollection.findOne({ email: user.email });
    if (registeredUser) {
      return res.status(409).send({ message: "E-mail já cadastrado!" });
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

  const { error } = signInSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorDetails = error.details.map((detail) => detail.message);
    return res.status(400).send(errorDetails);
  }

  const token = uuidV4();

  try {
    const registeredUser = await usersCollection.findOne({ email });

    if (!registeredUser) {
      return res.status(401).send({ message: "E-mail não cadastrado!" });
    }

    const passwordCheck = bcrypt.compareSync(password, registeredUser.password);

    if (!passwordCheck) {
      return res.status(401).send({ message: "Senha incorreta!" });
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
  const user = res.locals.user;

  try {
    res.send(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function deleteSignOut(req, res) {
  const user = res.locals.user;

  try {
    await sessionsCollection.deleteOne({ userId: ObjectId(user._id) });

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
