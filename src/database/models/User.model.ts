import bcrypt from "bcryptjs";
import IUser from "../../types/user";
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  BeforeCreate, 
} from "sequelize-typescript";

@Table({ timestamps: true, tableName: "users", modelName: "User" })
class User extends Model<IUser> {
  @PrimaryKey
  @Column(DataType.STRING)
  declare id: string;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare username: string;

  @Column(DataType.STRING)
  declare email: string;

  @Column(DataType.STRING)
  declare role: string;

  @Column(DataType.STRING)
  declare passwordHash: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @BeforeCreate
  static async encryptingPassword(user: IUser) {
    user.passwordHash = await bcrypt.hash("aaaaaaa", 10);
    return this;
  }
}

export default User;
