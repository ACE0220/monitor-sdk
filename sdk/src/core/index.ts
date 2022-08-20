import { DefaultOptions, Options, Version } from "../types/index";
import { createHistoryEvent } from "../utils/pv";

const MouseEventList: string[] = ['click', 'dbclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseleave',]

export default class Tracker {

    public data: Options;

    constructor(options: Options) {
        this.data = Object.assign(this.initDef(), options);
        this.installTracker();
    }

    // 兜底
    private initDef(): DefaultOptions {

        window.history['pushState'] = createHistoryEvent('pushState');
        window.history['replaceState'] = createHistoryEvent('replaceState');

        return <DefaultOptions>{
            sdkVersion: Version.version,
            historyTracker: false,
            hashTracker: true,
            domTracker: false,
            jsError: false
        }
    }

    public setUserId<T extends DefaultOptions['uuid']>(uuid: T) {
        this.data.uuid = uuid;
    }

    public setExtra<T extends DefaultOptions['extra']>(extra: T) {
        this.data.extra = extra;
    }

    private captureEvent<T>(mouseEventList: string[], targetKey: string, data?: T) {
        mouseEventList.forEach(ev => {
            window.addEventListener(ev, () => {
                this.reportTracker({
                    ev,
                    targetKey,
                    data
                })
            })
        })
    }

    private installTracker() {
        if (this.data.historyTracker) {
            this.captureEvent(['pushState', 'replaceState', 'popstate'], 'history-pv')
        }
        if (this.data.hashTracker) {
            this.captureEvent(['hashchange'], 'hash-pv')
        }
        if (this.data.domTracker) {
            this.targetKeyReport();
        }
        if(this.data.jsError) {
            this.jsError();
        }
    }

    // 手动上报
    public sendTracker<T>(data: T) {
        this.reportTracker(data);
    }

    // 自动上报
    private reportTracker<T>(data: T) {

        const params = Object.assign(this.data, data, { time: new Date().getTime() });

        let headers = {
            type: 'application/x-www-form-urlencoded',
        }
        let blob = new Blob([JSON.stringify(params)], headers)

        navigator.sendBeacon(this.data.requestUrl, blob);
    }

    private targetKeyReport() {
        MouseEventList.forEach(ev => {
            window.addEventListener(ev, (e) => {
                const target = e.target as HTMLElement;
                const targetKey = target.getAttribute('target-key');
                if (targetKey) {
                    this.reportTracker({
                        event: ev,
                        targetKey
                    })
                }
            })
        })
    }

    // 监听jsError
    private errEvent() {
        window.addEventListener('error', (ev) => {
            this.reportTracker({
                event:"error",
                targetKey: 'message',
                message: ev.message
            })
        })
    }

    // 监听promise错误
    private promiseReject() {
        window.addEventListener('unhandledrejection',(event) => {
            event.promise.catch(error => {
                this.reportTracker({
                    event: 'promise',
                    targetKey: 'message',
                    message: error
                })
            })
        })
    }

    private jsError() {
        this.errEvent();
        this.promiseReject();
    }

}
