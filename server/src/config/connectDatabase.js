const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('phongtro123', 'root', 'thuyen2312', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3307,
    logging: false
});

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// Sửa dòng này:
module.exports = connectDatabase;
