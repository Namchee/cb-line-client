import {
  ServiceParameters,
  ServiceResult,
  HandlerParameters,
  SmartService,
} from '../base';
import { ServerError, UserError } from '../../types/error';
import { REPLY, SMART_REPLY } from '../reply';
import { RuanganRepository } from '../../repository/ruangan';
import { KelasRepository } from '../../repository/kelas';
import { Kelas } from '../../entity/kelas';
import { format } from 'date-fns';

export class JadwalService extends SmartService {
  private readonly ruanganRepository: RuanganRepository;
  private readonly kelasRepository: KelasRepository;

  public constructor(
    ruanganRepository: RuanganRepository,
    kelasRepository: KelasRepository
  ) {
    super();

    this.identifier = 'jadwal';
    this.userRelated = false;
    this.handler = [this.handleFirstState, this.handleSecondState];
    this.keywords = [
      'tolong',
      'cari',
      'carikan',
      'jadwal',
      'kosong',
      'untuk',
      'ruangan',
    ];
    this.ruanganRepository = ruanganRepository;
    this.kelasRepository = kelasRepository;
  }

  public handle = async (
    {
      state,
      text,
    }: ServiceParameters
  ): Promise<ServiceResult> => {
    let result: ServiceResult = {
      state: -1,
      message: '',
    };

    for (let i = state; i < this.handler.length; i++) {
      try {
        result = await this.handler[i]({ text });
      } catch (e) {
        if (result.state === -1) {
          throw e;
        }

        break;
      }
    }

    if (result.state === -1) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    return result;
  }

  private handleFirstState = async (
    {}: HandlerParameters
  ): Promise<ServiceResult> => {
    const ruanganArray = await this.ruanganRepository.findAll();

    const buttonArray: string[] = [];

    for (const ruangan of ruanganArray) {
      buttonArray.push(ruangan.nama);
    }

    return {
      state: 1,
      message: {
        type: 'buttons',
        text: SMART_REPLY.CHOOSE_RUANGAN,
        message: buttonArray,
      },
    };
  }

  private handleSecondState = async (
    {
      text,
    }: HandlerParameters
  ): Promise<ServiceResult> => {
    const ruanganArray = await this.ruanganRepository.findAll();
    const dayOfWeek = new Date().getDay();

    for (const ruangan of ruanganArray) {
      const pattern = new RegExp('\\b' + ruangan.nama + '\\b', 'gi');

      if (pattern.test(text)) {
        const jadwal = await this.kelasRepository.findJadwal(
          ruangan,
          dayOfWeek
        );

        jadwal.sort(this.sortJadwal);

        const message = this.formatResponse(jadwal);

        return {
          state: 0,
          message,
        };
      }
    }

    throw new UserError(SMART_REPLY.RUANGAN_UNKNOWN);
  }

  private sortJadwal(a: Kelas, b: Kelas): number {
    if (a.waktuMulai.getTime() !== b.waktuMulai.getTime()) {
      return a.waktuMulai.getTime() - b.waktuMulai.getTime();
    }

    return a.waktuSelesai.getTime() - b.waktuSelesai.getTime();
  }

  private formatResponse(jadwal: Kelas[]): string {
    if (jadwal.length === 0) {
      return SMART_REPLY.RUANGAN_FREE;
    }

    let text = SMART_REPLY.RUANGAN_HEADER + '\n';
    const dateHelper = new Date();
    dateHelper.setHours(7, 0, 0, 0);

    if (jadwal[0].waktuMulai.getTime() > dateHelper.getTime()) {
      text +=
        format(dateHelper, 'HH:mm:ss') +
        ' - ' +
        format(jadwal[0].waktuMulai, 'HH:mm:ss');
    }

    for (let i = 0; i < jadwal.length - 1; i++) {
      if (
        jadwal[i].waktuSelesai.getTime() < jadwal[i + 1].waktuMulai.getTime()
      ) {
        if (text.length) {
          text += '\n';
        }
        text +=
          format(jadwal[i].waktuSelesai, 'HH:mm:ss') +
          ' - ' +
          format(jadwal[i + 1].waktuMulai, 'HH:mm:ss');
      }
    }

    dateHelper.setHours(17, 0, 0, 0);

    if (
      jadwal[jadwal.length - 1].waktuSelesai.getTime() < dateHelper.getTime()
    ) {
      if (text.length) {
        text += '\n';
      }
      text +=
          format(jadwal[jadwal.length - 1].waktuSelesai, 'HH:mm:ss') +
          ' - ' +
          format(dateHelper, 'HH:mm:ss');
    }

    return text;
  }
}
