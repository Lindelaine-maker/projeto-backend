module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define(
    'ProductImage',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: 'product_images',
      underscored: true,
      timestamps: true
    }
  );

  ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return ProductImage;
};
