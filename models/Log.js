module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define(
    "Log",
    {
      id_logs: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        allowNull: false,
      },
      activity_type: {
        type: DataTypes.STRING(90),
        allowNull: true,
      },
      module: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      id_user: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      tableName: "tb_log",
      timestamps: false,
      underscored: true,
    }
  );

  Log.associate = (models) => {
    Log.belongsTo(models.User, {
      foreignKey: "id_user",
    });
  };

  return Log;
};
