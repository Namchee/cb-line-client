import { LineResponse, LineService } from '../service';
import { UserRepository } from '../../repository/user';
import { LineMessage, TextMessage } from './messages/factory';
import { UserService } from '../base/user';
import { OpcodeError } from '../../types/error';

export class LineGantiService extends UserService implements LineService {
  public constructor(repository: UserRepository) {
    super(repository);
  }

  private formatMessage(contents: string): LineMessage {
    return new TextMessage(contents);
  }

  public async handle(
    id: string,
    state: number,
    text: string,
  ): Promise<LineResponse> {
    if (await !this.checkUserExistence(`line@${id}`)) {
      throw new Error(
        `Akun ini tidak terdaftar dengan NPM manapun.`
      );
    }

    switch (state) {
      case 1: {
        return this.handleFirstState(text, id);
      }
      case 2: {
        return this.handleSecondState(text, id);
      }
      default: {
        return this.handleFromStart(text, id);
      }
    }
  }

  private async handleFromStart(
    text: string,
    id: string
  ): Promise<LineResponse> {
    const fragments = text.split(' ');

    if (fragments[0] !== 'ganti') {
      throw new Error('Holy cow! This shouldn\'t happen');
    }

    if (fragments.length === 1) {
      const message = this.formatMessage(
        'Mohon masukkan NPM yang diasosiasikan dengan akun LINE ini'
      );

      return {
        state: 1,
        message,
      };
    }

    if (fragments.length === 2) {
      if (!this.isValidNPM(fragments[1])) {
        throw new Error(
          'NPM yang anda masukkan tidak valid, mohon masukkan ulang NPM anda'
        );
      }

      const user = await this.userRepository.find(`line@${id}`);

      if (user && user.npm !== fragments[1]) {
        throw new Error(
          `NPM yang anda masukkan salah. Mohon masukkan ulang NPM anda`
        );
      }

      const message = this.formatMessage(
        `Mohon masukkan NPM baru anda`
      );

      return {
        state: 2,
        message,
      };
    } else if (fragments.length === 3) {
      if (!this.isValidNPM(fragments[1])) {
        throw new Error(
          'NPM yang anda masukkan tidak valid, mohon masukkan ulang NPM anda'
        );
      }

      const user = await this.userRepository.find(`line@${id}`);

      if (user && user.npm !== fragments[1]) {
        throw new Error(
          `NPM yang anda masukkan salah, mohon masukkan ulang NPM anda`
        );
      }

      if (!this.isValidNPM(fragments[2])) {
        throw new Error(
          'NPM yang anda masukkan tidak valid, mohon masukkan ulang NPM anda'
        );
      }

      await this.userRepository.update(`line@${id}`, fragments[2]);

      const message = this.formatMessage(
        `NPM akun berhasil diubah`
      );

      return {
        state: 0,
        message,
      };
    } else {
      throw new OpcodeError(text);
    }
  }

  private async handleFirstState(
    text: string,
    id: string
  ): Promise<LineResponse> {
    if (!this.isValidNPM(text)) {
      throw new Error(
        'NPM yang anda masukkan salah, mohon masukkan ulang NPM anda'
      );
    }

    const user = await this.userRepository.find(`line@${id}`);

    if (user && user.npm !== text) {
      throw new Error(
        `NPM yang anda masukkan salah. Mohon ketik ulang NPM anda.`
      );
    }

    const message = this.formatMessage(
      `Mohon masukkan NPM baru anda`
    );

    return {
      state: 2,
      message,
    };
  }

  private async handleSecondState(
    text: string,
    id: string
  ): Promise<LineResponse> {
    if (!this.isValidNPM(text)) {
      throw new Error(
        `NPM yang anda masukkan salah. Mohon ketik ulang NPM anda.`
      );
    }

    await this.userRepository.update(`line@${id}`, text);

    const message = this.formatMessage(
      `NPM akun berhasil diubah`
    );

    return {
      state: 0,
      message,
    };
  }
}
