const jwt = require("jsonwebtoken");

// The secret key is used to generate the signature of the token.
// When a server validates a token, it uses the secret key to recompute the signature and checks if it matches the original signature.
// If the token is tampered with (e.g., payload changed), the signatures won’t match, and the token will be invalid.

async function generateJWT(payload) {
    let token = await jwt.sign(payload, "jwtkabohtjadakhatarnak secret")
    return token
}


async function verifyJWT(token){
    try {
        let data = await jwt.verify(token,"jwtkabohtjadakhatarnak secret");
        return data
    } catch (error) {
        return false;
    }
}

async function decodeJWT(token){
    let decoded = await jwt.decode(token);
    return decoded;
}

module.exports = { generateJWT, verifyJWT, decodeJWT };