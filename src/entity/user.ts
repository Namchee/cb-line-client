export class User {
  public readonly id: number;
  public readonly nomor: string;
  public readonly nama: string;
  public readonly role: number;

  private constructor(
    id: number,
    nomor: string,
    nama: string,
    role: number
  ) {
    this.id = id;
    this.nomor = nomor;
    this.nama = nama;
    this.role = role;
  }

  public static createUser(
    id: number,
    nomor: string,
    nama: string,
    role: number
  ): User {
    return new User(id, nomor, nama, role);
  }
}
