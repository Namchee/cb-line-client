export class MataKuliah {
  public readonly kode: string;
  public readonly nama: string;

  private constructor(kode: string, nama: string) {
    this.kode = kode;
    this.nama = nama;
  }

  public static createMataKuliah(kode: string, nama: string): MataKuliah {
    return new MataKuliah(kode, nama);
  }
}
