import jwt from 'jsonwebtoken'


// Authentication middleware
const auth = async (req, res, next) => {
    console.log('inside middleware')
    if (req.signedCookies.user) {
        req.user = req.signedCookies.user
        console.log('good cookie')
        next()
    } else {
        res.clearCookie('user')
        res.redirect('/auth/login?returnUrl' + req.url)
    }
}

export default auth
