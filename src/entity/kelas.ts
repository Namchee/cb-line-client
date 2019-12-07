export class Kelas {
  public readonly id: number;
  public readonly kode: string;
  public readonly jenis: number;
  public readonly waktuMulai: Date;
  public readonly waktuSelesai: Date;
  public readonly hari: number;

  private constructor(
    id: number,
    kode: string,
    jenis: number,
    waktuMulai: Date,
    waktuSelesai: Date,
    hari: number
  ) {
    this.id = id;
    this.kode = kode;
    this.jenis = jenis;
    this.waktuMulai = waktuMulai;
    this.waktuSelesai = waktuSelesai;
    this.hari = hari;
  }

  public static createKelas(
    id: number,
    jenis: number,
    kode: string,
    waktuMulai: Date,
    waktuSelesai: Date,
    hari: number
  ): Kelas {
    return new Kelas(
      id,
      kode,
      jenis,
      waktuMulai,
      waktuSelesai,
      hari,
    );
  }
}
