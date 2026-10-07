export interface CreateSuccessService<T> {
    success: Boolean;
    code: number;
    data: T;
}