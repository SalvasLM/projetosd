function applyExtraSetup(sequelize) {
    const { users, files } = sequelize.models;



    users.hasMany(files, {
        foreignKey: 'file_user_id'
    });
    files.belongsTo(users, {
        foreignKey: 'file_user_id'
    })




}

module.exports = { applyExtraSetup };