export interface LogFields {
    environment: string,
    userId: string,
    requestPath: string,
    elapsedTime: number,
    url: string,
    appVersion?: string
}