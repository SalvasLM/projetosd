const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('files', {
        file_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true

        },
        file_name: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        file_path: {
            type: DataTypes.STRING(300),
            allowNull: false
        },
        file_hash: {
            type: DataTypes.STRING(300),
            allowNull: false
        },
        file_file: {
            type: DataTypes.STRING(200),
            allowNull: false
        }

    })
}


