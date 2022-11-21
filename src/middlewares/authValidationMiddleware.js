import { sessionsCollection, usersCollection } from "../database/db.js";

export async function authValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send("Sessão não encontrada!");
  }

  try {
    const session = await sessionsCollection.findOne({ token });

    const user = await usersCollection.findOne({
      _id: session?.userId,
    });

    if (!user) {
      return res.status(401).send("Usuário não encontrado!");
    }

    delete user.password;

    res.locals.user = user;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }

  next();
}
