export class Account {
  public readonly account: string;
  public readonly userId: number;

  private constructor(account: string, userId: number) {
    this.account = account;
    this.userId = userId;
  }

  public static createAccount(account: string, userId: number): Account {
    return new Account(account, userId);
  }
}
