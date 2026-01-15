module.exports = (sequelize, DataTypes) => {
  const TokenBlacklist = sequelize.define(
    "TokenBlacklist",
    {
      token: {
        type: DataTypes.STRING(500),
        allowNull: false,
        primaryKey: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "tb_token_blacklist",
      timestamps: false,
      underscored: true,
    }
  );

  return TokenBlacklist;
};
