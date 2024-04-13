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

@Table({ timestamps: true, tableName: "series", modelName: "Serie" })
class Serie extends Model<ISerie> {
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
  @Column(DataType.JSON)
  declare genres: string[];

  @AllowNull(false)
  @Column(DataType.JSON) // auemntar aqui
  declare seasons: TypeObjectSeasons[];

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

export default Serie;
