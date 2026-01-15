module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define(
    "Appointment",
    {
      id_appointment: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      room: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(14),
        allowNull: true,
        defaultValue: "under_analysis",
      },
      id_user: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      tableName: "tb_appointment",
      timestamps: false,
      underscored: true,
    }
  );

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.User, {
      foreignKey: "id_user",
    });
  };

  return Appointment;
};
