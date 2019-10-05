import {
  EntityManager,
} from 'typeorm';

export abstract class Repository {
  protected readonly manager: EntityManager;

  public constructor(manager: EntityManager) {
    this.manager = manager;
  }
}
