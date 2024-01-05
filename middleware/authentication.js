// Authentication middleware
async function auth(req, res, next) {
    if (req.signedCookies.user) {
        req.user = req.signedCookies.user
        next()
    } else {
        res.clearCookie('user')
        res.redirect('/auth/login?returnUrl' + req.url)
    }
}

export default auth
