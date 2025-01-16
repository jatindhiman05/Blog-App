const jwt = require("jsonwebtoken");

function generateJWT() {
    jwt.sign({}, "jwtkabohtjadakhatarnak secret")
}

module.exports = generateJWT;