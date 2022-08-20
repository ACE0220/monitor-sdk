/**
 * @uuid pv/uv
 * @requestUrl 上报地址 
 * @historyTracker history上报 history和hash上报二选一
 * @hashTracker hash上报
 * @domTracker 是否上报点击事件
 * @sdkVersion sdk版本
 * @extra 透传字段
 * @jsError 是否上报js和promise异常
 * 
 */
export interface DefaultOptions {
    uuid: string | undefined,
    requestUrl: string | undefined,
    historyTracker: boolean,
    hashTracker: boolean,
    domTracker: boolean,
    sdkVersion: string | number,
    extra: Record<string, any> | undefined,
    jsError: boolean,
}

export interface Options extends Partial<DefaultOptions> {
    requestUrl: string
}

export enum Version {
    version = '0.0.1'
}