import { EntityManager } from 'typeorm';

export abstract class CustomRepository {
  protected readonly manager: EntityManager;

  public constructor(manager: EntityManager) {
    this.manager = manager;
  }
}
