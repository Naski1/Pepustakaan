module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define('tb_tokens', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Tabel yang terkait
          key: 'id'
        }
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    });
  
    return Token;
  };
  