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
} from "sequelize-typescript";


config();

@Table({ timestamps: true, tableName: "movies", modelName: "Movie" })
class Movie extends Model<IMovieSchema> {
  @PrimaryKey
  @Column(DataType.STRING)
  declare id: string

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
  declare genres: string;
  
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare duration: number;
  
  @AllowNull(false)
  @Column(DataType.STRING(1000))
  declare description: string;
  
  @AllowNull(false)
  @Column(DataType.DECIMAL)
  declare rating: number;
  
  @Column(DataType.STRING)
  declare urlTrailer: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

export default Movie;
