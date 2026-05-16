const router = require('express').Router()
const { Blog, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')
const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)

    if (!req.blog) {
        return res.status(404).end()
    }
    next()
}
router.get('/', async (req, res) => {
    const where = {}

    if (req.query.search) {
        where[Op.or] = [
            {
                title: {
                    [Op.iLike]: `%${req.query.search}%`
                }
            },
            {
                author: {
                    [Op.iLike]: `%${req.query.search}%`
                }
            }
        ]
    }
    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name', 'username']
        },
        where
    })
    res.json(blogs)
})
router.post('/', tokenExtractor, async (req, res) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        if (!user) {
            return res.status(401).json({ error: 'invalid token' })
        }
        const blog = await Blog.create({
            ...req.body,
            userId: user.id
        })
        res.json(blog)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})
router.put('/:id', blogFinder, async (req, res) => {
    try {
        req.blog.likes = req.body.likes
        await req.blog.save()
        res.json(req.blog)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})
router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
    if (req.blog.userId !== req.decodedToken.id) {
        return res.status(401).json({ error: 'deletion not allowed' })
    }
    await req.blog.destroy()
    res.status(204).end()
})
module.exports = router