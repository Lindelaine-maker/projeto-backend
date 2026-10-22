module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      use_in_menu: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      price_with_discount: {
        type: DataTypes.FLOAT,
        allowNull: false
      }
    },
    {
      tableName: 'products',
      underscored: true,
      timestamps: true
    }
  );

  Product.associate = (models) => {
    Product.belongsToMany(models.Category, {
      through: models.ProductCategory,
      foreignKey: 'product_id',
      otherKey: 'category_id'
    });

    Product.hasMany(models.ProductImage, {
      foreignKey: 'product_id',
      as: 'images'
    });

    Product.hasMany(models.ProductOption, {
      foreignKey: 'product_id',
      as: 'options'
    });
  };

  return Product;
};
