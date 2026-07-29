import GitHubStrategy from "passport-github2";
import {pool} from "../config/database.js";


const options = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
};

const verify = async (accessToken, refreshToken, profile, callback) => {
    const { 
        _json: { id, name, login, avatar_url } 
    } = profile;

    const userData = {
        githubId: id,
        username: login,
        avatarUrl: avatar_url,
        accessToken
    };

    try{
        // write a query to find the user that matches userData.username
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [userData.username]);
        const user = result.rows[0];

        // if the user is not found in the database, insert/create a new user and insert them in the users table
        if (!user){
            const insertResult = await pool.query(
                `INSERT INTO users (githubid, username, avatarurl, accesstoken) VALUES ($1, $2, $3, $4) RETURNING *`,
                [userData.githubId, userData.username, userData.avatarUrl, userData.accessToken]
            );
            const newUser = insertResult.rows[0];

            return callback(null, newUser);
        }

        // in case the user is found
        return callback(null, user);

        
    } catch (error) {
        return callback(error);
    }

}

export const GitHub = new GitHubStrategy(options, verify); 