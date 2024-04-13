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
  ForeignKey,
  AllowNull,
  BelongsTo,
} from "sequelize-typescript";
import Movie from "./Movie.model";
import Serie from "./Serie.model";
import User from "./User.model";

config();

@Table({ timestamps: true, tableName: "users_media_info", modelName: "UserMediaInfo" })
class UserMediaInfo extends Model<IUserMediaInfo> {
  @PrimaryKey
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare userId: string;
  
  @AllowNull(false)
  @ForeignKey(() => Movie)
  @ForeignKey(() => Serie)
  @Column(DataType.UUID)
  declare mediaId: string;
  
  @Column(DataType.INTEGER)
  declare rating: number;

  @Column(DataType.BOOLEAN)
  declare favorite: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @BelongsTo(() => User)
  declare user: User[];

  @BelongsTo(() => Movie)
  declare movie: Movie[];

  @BelongsTo(() => Serie)
  declare serie: Serie[];
}

export default UserMediaInfo;
