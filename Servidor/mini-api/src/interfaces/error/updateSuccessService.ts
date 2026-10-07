export interface UpdateSuccessService<T> {
    success: Boolean;
    code: number;
    data: T;
    index: number;
}

