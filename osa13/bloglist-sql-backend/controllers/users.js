const router = require('express').Router()
const { User, Blog } = require('../models')
const { tokenExtractor } = require('../util/middleware')

const isAdmin = async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id)

    if (!user || !user.admin) {
        return res.status(401).json({ error: 'operation not allowed' })
    }

    next()
}

router.get('/', async (req, res) => {
    const users = await User.findAll({
        attributes: { exclude: ['password'] },
        include: {
            model: Blog,
            attributes: {
                exclude: ['userId']
            }
        }
    })

    res.json(users)
})

router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.json({
            id: user.id,
            username: user.username,
            name: user.name
        })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

router.put('/:username', async (req, res) => {
    const user = await User.findOne({
        where: {
            username: req.params.username
        }
    })

    if (!user) {
        return res.status(404).end()
    }
    try {
        user.name = req.body.name
        await user.save()

        res.json({
            id: user.id,
            username: user.username,
            name: user.name,
            disabled: user.disabled,
            admin: user.admin
        })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

router.put('/:username/disable', tokenExtractor, isAdmin, async (req, res) => {
    const user = await User.findOne({
        where: {
            username: req.params.username
        }
    })

    if (!user) {
        return res.status(404).end()
    }

    user.disabled = req.body.disabled
    await user.save()

    res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        disabled: user.disabled,
        admin: user.admin
    })
})

router.get('/:id', async (req, res) => {
    let readWhere = undefined
    if (req.query.read === 'true') {
        readWhere = { read: true }
    }
    if (req.query.read === 'false') {
        readWhere = { read: false }
    }
    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Blog,
                attributes: { exclude: ['userId'] }
            },
            {
                model: Blog,
                as: 'readings',
                attributes: { exclude: ['userId'] },
                through: {
                    attributes: ['id', 'read'],
                    ...(readWhere ? { where: readWhere } : {})
                }
            }
        ]
    })
    if (!user) {
        return res.status(404).end()
    }
    res.json(user)
})
module.exports = router