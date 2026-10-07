export interface SuccessService<T> {
    success: Boolean;
    code: number;
    data: T;
}