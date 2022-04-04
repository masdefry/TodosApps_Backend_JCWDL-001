module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true, 
            allowNull: false, 
            autoIncrement: true
        },
        username:{
            type: DataTypes.STRING(45),
            allowNull: false 
        },
        email:{
            type: DataTypes.STRING(45),
            allowNull: false 
        },
        password:{
            type: DataTypes.STRING(45), 
            allowNull: false
        }
    })

    return users
}