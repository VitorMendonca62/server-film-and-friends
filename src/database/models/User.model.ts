// Libraries
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  BeforeCreate,
  AllowNull,
} from "sequelize-typescript";


config();

@Table({ timestamps: true, tableName: "users", modelName: "User" })
class User extends Model<IUser> {
  @PrimaryKey
  @Column(DataType.STRING)
  declare id: string;
  
  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;
  
  @AllowNull(false)
  @Column(DataType.STRING)
  declare username: string;
  
  @AllowNull(false)
  @Column(DataType.STRING)
  declare email: string;
  
  @AllowNull(false)
  @Column(DataType.STRING)
  declare role: string;
  
  @AllowNull(false)
  @Column(DataType.VIRTUAL)
  declare password: string
  
  @Column(DataType.STRING)
  declare passwordHash: string;
  
  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @BeforeCreate
  static async encryptingPassword(user: IUser) {
    user.passwordHash = await bcrypt.hash(String(user.password), 10);
    return this;
  }

  async verifyPassword(password: string) {
    return bcrypt.compare(password, this.passwordHash);
  }
}

export default User;
