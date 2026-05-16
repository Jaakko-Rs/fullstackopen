const router = require('express').Router()
const { ReadingList, User, Blog } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
    const { userId, blogId } = req.body
    if (!blogId) {
        return res.status(400).json({ error: 'blogId missing' })
    }
    if (!userId) {
        return res.status(400).json({ error: 'userId missing' })
    }
    const blog = await Blog.findByPk(blogId)
    if (!blog) {
        return res.status(404).json({ error: 'blog not found' })
    }
    const user = await User.findByPk(userId)
    if (!user) {
        return res.status(404).json({ error: 'user not found' })
    }
    const existing = await ReadingList.findOne({
        where: { userId, blogId }
    })
    if (existing) {
        return res.status(400).json({ error: 'blog already in reading list' })
    }
    const reading = await ReadingList.create({
        userId,
        blogId,
        read: false
    })
    res.status(201).json({
        id: reading.id,
        user_id: reading.userId,
        blog_id: reading.blogId,
        read: reading.read
    })
})

router.put('/:id', tokenExtractor, async (req, res) => {
    const reading = await ReadingList.findByPk(req.params.id)
    if (!reading) {
        return res.status(404).end()
    }
    if (reading.userId !== req.decodedToken.id) {
        return res.status(401).json({ error: 'operation not allowed' })
    }
    reading.read = req.body.read
    await reading.save()
    res.json({
        id: reading.id,
        user_id: reading.userId,
        blog_id: reading.blogId,
        read: reading.read
    })
})
module.exports = router