export interface IResponseData<T = any> {
    data: T;
    status: number;
    headers: any;
}
export interface IQueryAsync {
    value: any,
    error: any,
    loading: any
}