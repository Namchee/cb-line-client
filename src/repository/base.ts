import {
  EntityManager,
  BaseEntity,
  Repository as BaseRepository,
} from 'typeorm';

export abstract class Repository<T extends BaseEntity> {
  protected readonly manager: EntityManager;

  public constructor(manager: EntityManager) {
    this.manager = manager;
  }

  protected abstract get repository(): BaseRepository<T>;

  public abstract exist: (id: string) => Promise<boolean>;
}
