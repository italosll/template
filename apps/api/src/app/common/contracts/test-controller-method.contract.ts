export type TestControllerMethodContract<T> = {
    methodName: keyof T,
    parameter:any,
    expectedResponse:any
}
