const { DataTypes } = require('sequelize');
var bcrypt = require("bcrypt");

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
    const user = sequelize.define('users', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true

        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_password: {
            type: DataTypes.STRING,
            allowNull: false
        }


    }, {
        hooks: {
            beforeCreate: async (user) => {
                if (user.user_password) {
                    const salt = await bcrypt.genSaltSync(10, 'a');
                    user.user_password = bcrypt.hashSync(user.user_password, salt);
                }
            },
            beforeUpdate:async (user) => {
                if (user.user_password) {
                    const salt = await bcrypt.genSaltSync(10, 'a');
                    user.user_password = bcrypt.hashSync(user.user_password, salt);
                }
            }
        },
        instanceMethods: {
            validPassword: (password) => {
                return bcrypt.compareSync(password, this.user_password);
            }
        }
    });
    user.prototype.validPassword = async (password, hash) => {
        return await bcrypt.compareSync(password, hash);
    }
    sequelize.sync();


    return user;
};


