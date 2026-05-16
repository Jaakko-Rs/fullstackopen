require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(
    process.env.PGDATABASE,
    process.env.PGUSER,
    process.env.PGPASSWORD,
    {
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
)
const main = async () => {
    try {
        await sequelize.authenticate()

        const blogs = await sequelize.query('SELECT * FROM blogs', {
            type: QueryTypes.SELECT
        })

        blogs.forEach(blog => {
            console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
        })

        await sequelize.close()
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}
main()