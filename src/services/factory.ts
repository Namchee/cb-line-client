import { Service, SmartService } from './service';
import { ServerError } from '../types/error';
import { REPLY } from './reply';

export class ServiceFactory {
  private readonly serviceList: Service[];
  private readonly smartServiceList: SmartService[];

  public constructor(serviceList: Service[]) {
    this.serviceList = serviceList;

    for (const service of serviceList) {
      if (service instanceof SmartService) {
        this.smartServiceList.push(service);
      }
    }
  }

  public createService = (
    text: string
  ): Service => {
    for (const service of this.serviceList) {
      if (!(service instanceof SmartService)) {
        if (text.split(' ')[0] === service.identifier) {
          return service;
        }
      }
    }

    return this.createSmartService(text);
  }

  public createServiceByName = (
    name: string
  ): Service => {
    this.serviceList.forEach((service) => {
      if (service.identifier === name) {
        return service;
      }
    });

    throw new ServerError(REPLY.ERROR, 500);
  }

  private createSmartService = (
    text: string
  ): SmartService => {
    let vocabulary = 0;
    const keywordScore: Map<string, number> = new Map();
    const serviceScore: Map<SmartService, number> = new Map();

    this.smartServiceList.forEach((service) => {
      const keywords = service.keywords;

      vocabulary += keywords.length;
      serviceScore.set(service, 0);

      keywords.forEach((keyword) => {
        keywordScore.set(keyword, (keywordScore.get(keyword) || 0) + 1);
      });
    });

    this.smartServiceList.forEach((service) => {
      const keywords = service.keywords;

      keywords.forEach((keyword) => {
        const keywordFrequency = keywordScore.get(keyword);

        if (!keywordFrequency) {
          throw new ServerError(REPLY.ERROR, 500);
        }

        if (text.indexOf(keyword) !== -1) {
          const score = Math.log2(vocabulary / keywordFrequency);

          const serviceCurrentScore = serviceScore.get(service);

          if (!serviceCurrentScore) {
            throw new ServerError(REPLY.ERROR, 500);
          }

          serviceScore.set(service, serviceCurrentScore + score);
        }
      });
    });

    let desiredService: SmartService = this.smartServiceList[0];

    serviceScore.forEach((value, key) => {
      const desiredServiceScore = serviceScore.get(desiredService);

      if (!desiredServiceScore) {
        throw new ServerError(REPLY.ERROR, 500);
      }

      if (desiredServiceScore < value) {
        desiredService = key;
      }
    });

    return desiredService;
  }
}
