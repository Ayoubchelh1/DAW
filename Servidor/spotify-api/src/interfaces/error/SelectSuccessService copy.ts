export interface SelectSuccessService<T> {
    success: Boolean;
    code: number;
    data: T;
}