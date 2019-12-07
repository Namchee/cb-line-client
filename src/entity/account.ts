export class Account {
  public readonly id: number;
  public readonly provider: string;
  public readonly account: string;

  private constructor(id: number, provider: string, account: string) {
    this.id = id;
    this.provider = provider;
    this.account = account;
  }

  public static createAccount(
    id: number,
    provider: string,
    account: string
  ): Account {
    return new Account(id, provider, account);
  }
}
