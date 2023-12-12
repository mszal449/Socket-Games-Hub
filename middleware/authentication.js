import jwt from 'jsonwebtoken'


// Authentication middleware
const auth = async (req, res, next) => {
    try {
        // Read authentication token
        const token = await req.cookies.token

        if (!token) {
            // If token was not found, return the information to user
            req.user = { authenticated: false }
        } else {
            // Verify the token
            const payload = await jwt.verify(token, process.env.JWT_SECRET)

            // Return data stored inside the token and confirm authentication
            req.user = { userId: payload.userId, username: payload.username, authenticated: true }
        }

        next()
    } catch (error) {
        // In case of an error, end session
        res.clearCookie('token')
        req.user = { authenticated: false }
        next()
    }
}


export default auth
