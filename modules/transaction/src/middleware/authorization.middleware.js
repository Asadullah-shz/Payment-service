const jwt = require("jsonwebtoken")

function authorize(...allowedRoles) {
    return async function (req, res, next) {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_TOKEN)

            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({
                    message: "You Don't have access"
                })
            }

            req.user = decoded;
            next()

        } catch (err) {
            console.log(err)
            return res.status(401).json({
                message: "unauthorized"
            })
        }
    }
}

module.exports = { authorize }