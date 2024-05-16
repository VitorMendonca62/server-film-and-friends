// Libraries
import { config } from "dotenv";
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  HasMany,
} from "sequelize-typescript";
import UsersMediaInfo from "./UserMediaInfo.model";

config();

@Table({ timestamps: true, tableName: "movies", modelName: "Movie" })
class Movie extends Model<IMovie> {
  @PrimaryKey
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare idAPI: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare title: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare releaseDate: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare posterPath: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare backgroundPath: string;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare genres: string[];

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare duration: number;

  @AllowNull(false)
  @Column(DataType.STRING(1000))
  declare description: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(2))
  declare rating: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare raters: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare favorites: number;

  @Column(DataType.STRING)
  declare urlTrailer: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @HasMany(() => UsersMediaInfo)
  declare UsersMediaInfo: UsersMediaInfo[];
}

export default Movie;
