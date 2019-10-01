export class Client {
  public readonly nama: string;
  public readonly client_id: string;
  public readonly url: string;

  private constructor(nama: string, client_id: string, url: string) {
    this.client_id = client_id;
    this.url = url;
  }

  public static createClient(
    nama: string,
    client_id: string,
    url: string
  ): Client {
    return new Client(nama, client_id, url);
  }
}
