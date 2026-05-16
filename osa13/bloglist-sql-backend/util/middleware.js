const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { Session, User } = require('../models')

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({ error: 'token missing' })
    }
    const token = authorization.substring(7)
    try {
        const decodedToken = jwt.verify(token, SECRET)
        const session = await Session.findOne({
            where: { token }
        })
        if (!session) {
            return res.status(401).json({ error: 'session invalid' })
        }
        const user = await User.findByPk(decodedToken.id)

        if (!user || user.disabled) {
            return res.status(401).json({ error: 'account disabled' })
        }
        req.decodedToken = decodedToken
        req.token = token
        next()
    } catch {
        return res.status(401).json({ error: 'token invalid' })
    }
}
module.exports = { tokenExtractor }