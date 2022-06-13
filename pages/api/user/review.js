import { getSession } from "next-auth/react";

import { hashPassword, verifyPassword } from "../../../helpers/auth";
import { connectDatabase } from "../../../helpers/db-utils";

async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  const userEmail = session.user.email;
  //const oldPassword = req.body.oldPassword;
  const enteredPassword = req.body.password;
  const review = req.body.review;

  const client = await connectDatabase();

  const usersCollection = client.db().collection("users");

  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: "User not found." });
    client.close();
    return;
  }

  const storedPassword = user.password;

  const passwordsAreEqual = await verifyPassword(
    enteredPassword,
    storedPassword
  );

  if (!passwordsAreEqual) {
    res.status(403).json({ message: "Invalid password." });
    client.close();
    return;
  }

  //const hashedPassword = await hashPassword(newPassword);

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { review: review } }
  );

  client.close();
  res.status(200).json({ message: "Password updated!" });
}

export default handler;
