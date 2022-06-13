//The idea here is to ensure that unmoderated post is not shown to the public.
//if the post is moderated, return true no matter who is logged in.
//if the post is not moderated but the persons logged in is the author or the admin retun true.
//else if the post is not moderated and the person logged in is not admin don't show it.
//if no log in and no moderation return false

import { getSession } from "next-auth/react";

async function handler(req, res) {
  //const eventId = req.query.eventId;
  const adminArray = [process.env.admin_1, process.env.admin_2];

  if (req.method === "POST") {
    const { authorId, moderated } = req.body;

    const session = await getSession({ req: req });

    if (moderated) {
      res.status(201).json({ message: true });
      return;
    }

    // if (!session && !moderated) {
    //   res.status(201).json({ message: false });
    //   return;
    // }

    if (!moderated && session) {
      if (
        session.user.email === authorId ||
        adminArray.includes(session.user.email)
      ) {
        res.status(201).json({ message: true });
        return;
      } else {
        res.status(201).json({ message: false });
        return;
      }
    } else {
      res.status(201).json({ message: false });
      return;
    }
  }
}

export default handler;
