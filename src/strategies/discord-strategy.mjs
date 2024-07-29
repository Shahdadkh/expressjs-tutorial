import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";

/*
    # Anson_OAuth2
    https://discord.com/developers/applications/1267547314185048238/oauth2

    Client ID: 1267547314185048238
    Client Secret: r_GYniodHEpj5NU3FCNAbdpG0bwOrQFt
    Redirects: http://localhost:3000/api/auth/discord/redirect
*/

passport.serializeUser((user, done) => {
  console.log(`Inside Serialize User`);
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await DiscordUser.findById(id);
    return findUser ? done(null, findUser) : done(null, null);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: "1267547314185048238",
      clientSecret: "r_GYniodHEpj5NU3FCNAbdpG0bwOrQFt",
      callbackURL: "http://localhost:3000/api/auth/discord/redirect",
      scope: ["identify"], //"guilds", "email"
    },
    async (accessToken, refreshToken, profile, done) => {
      let findUser;
      try {
        findUser = await DiscordUser.findOne({ discordId: profile.id });
      } catch (err) {
        return done(err, null);
      }

      try {
        if (!findUser) {
          const newUser = new DiscordUser({
            username: profile.username,
            discordId: profile.id,
          });
          const newSavedUser = await newUser.save();
          return done(null, newSavedUser);
        }
        return done(null, findUser);
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);
