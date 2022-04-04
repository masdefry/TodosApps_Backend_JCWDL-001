// Import Sequelize
const { Sequelize, DataTypes } = require('sequelize')

// Create Connection to Database
const sequelize = new Sequelize('sequelize', 'root', '20121995', {
    host: 'localhost',
    dialect: 'mysql'
})

sequelize.authenticate()
.then(() => {
    console.log('Sequilize Authenticate Success!')
})
.catch(() => {
    console.log('Sequelize Authenticate Error!')
})

const db = {}

db.Sequelize = Sequelize 
db.sequelize = sequelize

db.users = require('./Users')(sequelize, DataTypes)
db.todos = require('./Todos')(sequelize, DataTypes)

// One to Many
db.users.hasMany(db.todos, {
    foreignKey: 'users_id', 
})

db.todos.belongsTo(db.users)

db.sequelize.sync()
.then(() => {
    console.log('Synchronized!')
})

module.exports = db