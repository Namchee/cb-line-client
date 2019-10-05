export class Account {
  public readonly provider: string;
  public readonly account: string;

  private constructor(provider: string, account: string) {
    this.account = account;
  }

  public static createAccount(provider: string, account: string): Account {
    return new Account(provider, account);
  }
}
