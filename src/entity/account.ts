export class Account {
  public readonly account: string;

  private constructor(account: string) {
    this.account = account;
  }

  public static createAccount(account: string): Account {
    return new Account(account);
  }
}
