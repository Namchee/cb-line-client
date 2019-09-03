import { UserDocument, User } from './../../model/user';
import { Model } from 'mongoose';
import { toEntity } from './../mapper/user';
import { Repository } from './../base';

export class UserRepository implements Repository {
  private readonly model: Model<UserDocument>;

  public constructor(model: Model<UserDocument>) {
    this.model = model;
  }

  public async exist(id: string): Promise<boolean> {
    return this.model.exists({
      user_id: id,
    });
  }

  public async find(id: string): Promise<User | null> {
    const userDocument = await this.model.findOne({
      user_id: id,
    });

    return userDocument ?
      toEntity(userDocument) :
      null;
  }

  public async create(id: string, npm: string): Promise<User | null> {
    const exist: boolean = await this.exist(id);

    if (exist) {
      return null;
    }

    const newUser = {
      user_id: id,
      npm,
    };

    const insertedDocument = await this.model.create(newUser);

    return toEntity(insertedDocument);
  }

  public async update(id: string, npm: string): Promise<User | null> {
    const updatedInfo = {
      user_id: id,
      npm,
    };

    const updatedDocument = await this.model.findOneAndUpdate(
      {
        user_id: id,
      },
      updatedInfo,
      { new: true },
    );

    return updatedDocument ?
      toEntity(updatedDocument) :
      null;
  }

  public async delete(id: string): Promise<User | null> {
    const deletedUser = await this.model.findOneAndDelete({
      user_id: id,
    });

    return deletedUser ?
      toEntity(deletedUser) :
      null;
  }
}
