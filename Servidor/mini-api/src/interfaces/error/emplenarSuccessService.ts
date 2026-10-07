export interface emplenarSuccesService<T> {
    success: Boolean;
    code: number;
    data: T;
}