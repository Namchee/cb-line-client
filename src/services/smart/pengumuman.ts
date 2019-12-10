import {
  ServiceResult,
  HandlerParameters,
  ServiceParameters,
  SmartService,
} from '../base';
import { UserAccountRepository } from '../../repository/user-account';
import { ServerError, UserError, isUserError } from '../../types/error';
import { REPLY, USER_REPLY, SMART_REPLY } from '../reply';
import { MataKuliahRepository } from '../../repository/mata-kuliah';
import { Message, MessageBody } from '../message/type';
import { pengumuman } from './../../database/dummies/svc-id.json';
import { mataKuliah } from './../../database/dummies/mk-kw.json';
import { PengumumanRepository } from '../../repository/pengumuman';

export class PengumumanService extends SmartService {
  private readonly userAccountRepository: UserAccountRepository;
  private readonly mataKuliahRepository: MataKuliahRepository;
  private readonly pengumumanRepository: PengumumanRepository;

  private readonly vocabulary: Map<string, number>;

  public constructor(
    userAccountRepository: UserAccountRepository,
    mataKuliahRepository: MataKuliahRepository,
    pengumumanRepository: PengumumanRepository
  ) {
    super();

    this.identifier = 'pengumuman';
    this.userRelated = true;
    this.handler = [this.handleFirstState, this.handleSecondState];
    this.keywords = pengumuman;
    this.userAccountRepository = userAccountRepository;
    this.mataKuliahRepository = mataKuliahRepository;
    this.pengumumanRepository = pengumumanRepository;

    this.vocabulary = new Map();

    mataKuliah.forEach((mk) => {
      mk.keywords.forEach((keyword) => {
        this.vocabulary.set(mk.id, (this.vocabulary.get(keyword) || 0) + 1);
      });
    });
  }

  public handle = async (
    {
      state,
      text,
      account,
      provider,
    }: ServiceParameters
  ): Promise<ServiceResult> => {
    if (!account || !provider) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    const user = await this.userAccountRepository.exist(provider, account);

    if (!user) {
      throw new UserError(USER_REPLY.NO_ASSOCIATE);
    }

    let result: ServiceResult = {
      state: -1,
      message: [],
    };

    for (let i = state; i < this.handler.length; i++) {
      try {
        result = await this.handler[i]({ text, account, provider });
      } catch (e) {
        if (result.state === -1 || i === 0 || !isUserError(e)) {
          throw e;
        }

        const err = e as UserError;

        result = {
          state: result.state,
          message: [
            Message.createTextMessage([
              MessageBody.createTextBody(err.message),
            ]),
            ...result.message,
          ],
        };

        break;
      }
    }

    if (result.state === -1) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    return result;
  }

  private handleFirstState = async (
    {
      account,
      provider,
    }: HandlerParameters
  ): Promise<ServiceResult> => {
    if (!account || !provider) {
      throw new ServerError(REPLY.ERROR, 500);
    }

    const user = await this.userAccountRepository.findUserByAccount(
      provider,
      account
    );

    if (!user) {
      throw new UserError(USER_REPLY.NO_ASSOCIATE);
    }

    const mataKuliahList = await this.mataKuliahRepository.findUserMataKuliah(
      user
    );

    const buttonArray: MessageBody[] = [];

    for (const mataKuliah of mataKuliahList) {
      buttonArray.push(
        MessageBody.createButtonBody(mataKuliah.nama, mataKuliah.nama),
      );
    }

    return {
      state: 1,
      message: [
        Message.createButtonsMessage([
          MessageBody.createTextBody(SMART_REPLY.CHOOSE_MATA_KULIAH),
          ...buttonArray,
        ]),
      ],
    };
  }

  private handleSecondState = async (
    {
      text,
    }: HandlerParameters
  ): Promise<ServiceResult> => {
    const mataKuliahScore: Map<string, number> = new Map();

    mataKuliah.forEach((mk) => {
      mk.keywords.forEach((keyword) => {
        const pattern = new RegExp('\\b' + keyword + '\\b', 'gi');

        if (pattern.test(text)) {
          const wordFrequency = this.vocabulary.get(keyword) || 1;
          const termWeight = Math.log2(
            mataKuliah.length / wordFrequency
          );

          mataKuliahScore.set(
            mk.id,
            (mataKuliahScore.get(mk.id) || 0) + termWeight
          );
        }
      });
    });

    let selectedMataKuliah = mataKuliah[0].id;
    let currentScore = mataKuliahScore.get(selectedMataKuliah);

    mataKuliahScore.forEach((value, key) => {
      if (!currentScore || value > currentScore) {
        selectedMataKuliah = key;
        currentScore = value;
      }
    });

    if (!currentScore || currentScore === 0) {
      throw new UserError(SMART_REPLY.MATA_KULIAH_UNKNOWN);
    }

    const mataKuliahEntity = await this.mataKuliahRepository
      .findByKode(selectedMataKuliah);

    if (!mataKuliahEntity) {
      throw new ServerError('Mata Kuliah not found', 500);
    }

    const pengumuman = await this.pengumumanRepository
      .findPengumumanByMataKuliah(selectedMataKuliah);

    if (pengumuman === null) {
      return {
        state: 0,
        message: [
          Message.createTextMessage([
            MessageBody.createTextBody(SMART_REPLY.NO_PENGUMUMAN),
          ]),
        ],
      };
    }

    return {
      state: 0,
      message: [
        Message.createTextMessage([
          MessageBody.createTextBody(
            'Pengumuman terbaru untuk mata kuliah ' +
              mataKuliahEntity.nama +
              ':'
          ),
        ]),
        Message.createTextMessage([
          MessageBody.createTextBody(pengumuman.isiPengumuman),
        ]),
      ],
    };
  }
}
