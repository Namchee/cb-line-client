export class Pengumuman {
  public readonly isiPengumuman: string;

  private constructor(isiPengumuman: string) {
    this.isiPengumuman = isiPengumuman;
  }

  public static createPengumuman(
    isiPengumuman: string
  ): Pengumuman {
    return new Pengumuman(isiPengumuman);
  }
}
