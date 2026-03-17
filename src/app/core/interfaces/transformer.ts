export interface transformer <T>{
    transform: (cmsComponent: any, ...params: any) => T
}