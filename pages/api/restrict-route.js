import { getSession } from "next-auth/react";

async function handler(req, res) {
  //const eventId = req.query.eventId;
  const adminArray = [process.env.admin_1, process.env.admin_2];

  if (req.method === "POST") {
    const { authorId } = req.body;

    const session = await getSession({ req: req });

    if (!session) {
      res.status(201).json({ message: false });
      return;
    }
    if (
      session.user.email === authorId ||
      adminArray.includes(session.user.email)
    ) {
      res.status(201).json({ message: true });
      return;
    }
  }
  if (req.method === "GET") {
    const session = await getSession({ req: req });

    if (!session) {
      res.status(201).json({ message: false });
      return;
    }
    try {
      if (adminArray.includes(session.user.email)) {
        res.status(201).json({ message: true });
        return;
      } else {
        res.status(201).json({ message: false });
        return;
      }
    } catch (error) {
      res.status(201).json({ message: false });
      return;
    }
  }
}

export default handler;
