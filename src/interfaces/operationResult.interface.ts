export interface IOperationResult<T = void> {
    success: boolean;
    result?: T;
    message?: string;
}
