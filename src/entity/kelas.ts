import { MataKuliah } from './mata-kuliah';
import { Ruangan } from './ruangan';
import { User } from './user';

export class Kelas {
  public readonly id: number;
  public readonly mataKuliah: MataKuliah;
  public readonly user: User[];
  public readonly ruangan: Ruangan;
  public readonly kode: string;
  public readonly jenis: number;
  public readonly waktuMulai: Date;
  public readonly waktuSelesai: Date;
  public readonly hari: number;

  private constructor(
    id: number,
    mataKuliah: MataKuliah,
    user: User[],
    ruangan: Ruangan,
    kode: string,
    jenis: number,
    waktuMulai: Date,
    waktuSelesai: Date,
    hari: number
  ) {
    this.id = id;
    this.mataKuliah = mataKuliah;
    this.user = user;
    this.ruangan = ruangan;
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
    mataKuliah: MataKuliah,
    user: User[],
    ruangan: Ruangan,
    waktuMulai: Date,
    waktuSelesai: Date,
    hari: number
  ): Kelas {
    return new Kelas(
      id,
      mataKuliah,
      user,
      ruangan,
      kode,
      jenis,
      waktuMulai,
      waktuSelesai,
      hari
    );
  }
}
