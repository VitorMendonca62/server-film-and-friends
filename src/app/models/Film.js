/* eslint-disable camelcase */

import { Model, DataTypes } from 'sequelize';

class Film extends Model {
  static init(sequelize) {
    super.init(
      {
        id_api: DataTypes.STRING,
        title: DataTypes.STRING,
        release_date: DataTypes.INTEGER,
        genres: DataTypes.JSON,
        duration: DataTypes.STRING,
        description: DataTypes.STRING,
        rating: DataTypes.STRING,
        url_trailer: DataTypes.STRING,
        poster_path: DataTypes.STRING,
        background_path: DataTypes.STRING,
      },
      { sequelize },
    );
  }
}

export default Film;
