export class Pengumuman {
  public readonly id: number;
  public readonly isiPengumuman: string;

  private constructor(id: number, isiPengumuman: string) {
    this.id = id;
    this.isiPengumuman = isiPengumuman;
  }

  public static createPengumuman(
    id: number,
    isiPengumuman: string
  ): Pengumuman {
    return new Pengumuman(id, isiPengumuman);
  }
}
