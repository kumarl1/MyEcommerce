import { Injectable } from '@angular/core';
import { LogFields } from './logger.model';
import { Logger } from './logger';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LogService {
  private logger: Logger;
  userId: 'Mahaveer';

  constructor() {
     this.initialize();
  }

  public initialize() {
    this.logger = new Logger(environment.appName, environment.endpoints.elasticSearchEndpoint);
  }

  public logHttpInfo(info: any, elapsedTime: number, requestPath: string) {
    // TODO: create and set correlation id
    const url = location.href;
    const logFields: LogFields = {
      environment: environment.env,
      userId: this.userId,
      requestPath,
      elapsedTime,
      url,
    };

    this.logger.log('Information', `${info}`, logFields);
  }

  public logWarning(errorMsg: string) {
    const url = location.href;

    const logFields: LogFields = {
      environment: environment.env,
      userId: this.userId,
      requestPath: '',
      elapsedTime: 0,
      url: url,
    };

    this.logger.log('Warning', errorMsg, logFields);
  }

  public logError(errorMsg: string) {
    const url = location.href;

    const logFields: LogFields = {
      environment: environment.env,
      userId: this.userId,
      requestPath: '',
      elapsedTime: 0,
      url: url,
    };

    this.logger.log('Error', errorMsg, logFields);
  }

  public logInfo(info: any) {
    const url = location.href;

    const logFields: LogFields = {
      environment: environment.env,
      userId: this.userId,
      requestPath: '',
      elapsedTime: 0,
      url,
    };

    this.logger.log('Information', info, logFields);
  }
}