import { query as queryFauna } from 'faunadb'

import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { fauna } from '../../../services/fauna'

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    })
  ],
  callbacks: {
    async signIn(user, account, profile) {
      try {
        const { email } = user

        await fauna.query(
          queryFauna.If(
            queryFauna.Not(
              queryFauna.Exists(
                queryFauna.Match(
                  queryFauna.Index('user_by_email'),
                  queryFauna.Casefold(email)
                )
              )
            ),
            queryFauna.Create(queryFauna.Collection('users'), {
              data: { email }
            }),
            queryFauna.Get(
              queryFauna.Match(
                queryFauna.Index('user_by_email'),
                queryFauna.Casefold(email)
              )
            )
          )
        )
        
        return true
      } catch {
        return false
      }
    }
  }
})