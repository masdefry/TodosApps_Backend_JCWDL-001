module.exports = (sequelize, DataTypes) => {
    const todos = sequelize.define('todos', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true, 
            allowNull: false, 
            autoIncrement: true
        },
        todo:{
            type: DataTypes.STRING(45),
            allowNull: false 
        },
        description:{
            type: DataTypes.STRING(45),
            allowNull: false 
        },
        status_id:{
            type: DataTypes.STRING(45), 
            allowNull: false
        }
    })

    return todos
}