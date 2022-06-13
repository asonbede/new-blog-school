import NextAuth from "next-auth";
//import Providers from "next-auth/providers";
import CredentialsProvider from 'next-auth/providers/credentials'

//import { verifyPassword } from '../../../lib/auth';kkkkkk
//import { connectToDatabase } from '../../../lib/db';
import { connectDatabase } from "../../../helpers/db-utils";
import { verifyPassword } from "../../../helpers/auth";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await connectDatabase();

        const usersCollection = client.db().collection("users");

        const usernameCheck = await usersCollection.findOne({
          username: credentials.username,
        });

        if (!usernameCheck) {
          client.close();
          throw new Error("No user with that email found!");
        }

        const isValid = await verifyPassword(
          credentials.password,
          usernameCheck.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Incorrect password. Could not log you in!");
        }

        client.close();
        return {
          email: usernameCheck.email,
          name: { name: usernameCheck.name, username: usernameCheck.username },
          image: {
            imageUrl: usernameCheck.imageLink,
            interest: usernameCheck.interest,
          },
        };
        throw new Error('Incorrect Credentials') 
      },
    }),
  ],
});

// import NextAuth from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'

// //Api route function that is returned from next auth
// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       async authorize(credentials) {
//         // credentials will to passed from our login form
//         // Your own logic here either check agains database or api endpoint
//         // e.g. verify password if valid return user object.
//         const user = {
//           id: 1,
//           name: 'john',
//           email: 'user@example.com',
//           password: '12345',
//         }
//         if (
//           credentials.email === user.email &&
//           credentials.password === user.password
//         )
//           return user
//         throw new Error('Incorrect Credentials') // This will be error message displayed in login form
//       },
//     }),
//   ],
//   callbacks: {
//     // called after sucessful signin
//     jwt: async ({ token, user }) => {
//       if (user) token.id = user.id
//       return token
//     }, // called whenever session is checked
//     session: async ({ session, token }) => {
//       if (token) session.id = token.id
//       return session
//     },
//   },
//   secret: 'SECRET_HERE',
//   session: {
//     strategy: 'jwt',
//     maxAge: 1 * 24 * 60 * 60, // 1d
//   },
//   jwt: {
//     secret: 'SECRET_HERE',
//     encryption: true,
//   },
// })