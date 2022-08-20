import { DefaultOptions, Options, Version } from "../types/index";
import { createHistoryEvent } from "../utils/pv";

export default class Tracker {

    public data: Options;

    constructor(options: Options) {
        this.data = Object.assign(this.initDef(), options);
        this.installTracker();
    }

    // 兜底
    private initDef(): DefaultOptions {

        window.history['replaceState'] = createHistoryEvent('replaceState');
        window.history['pushState'] = createHistoryEvent('pushState');

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
                console.log('监听到了', ev);
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
            this.captureEvent(['pushState', 'replaceState', 'popState'], 'history-pv')
        }
        if (this.data.hashTracker) {
            this.captureEvent(['pushState'], 'history-pv')
        }
    }

    // 手动上报
    public sendTracker <T>(data: T) {
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
}
