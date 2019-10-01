export class Ruangan {
  public readonly nama: string;

  private constructor(nama: string) {
    this.nama = nama;
  }

  public static createRuangan(nama: string): Ruangan {
    return new Ruangan(nama);
  }
}
