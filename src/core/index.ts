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

    private captureEvent <T>(mouseEventList: string[], targetKey: string, data?:T) {
        mouseEventList.forEach(ev => {
            window.addEventListener(ev, () => {
                console.log('监听到了', ev);
            })
        })
    }

    private installTracker() {
        if(this.data.historyTracker) {
            this.captureEvent(['pushState', 'replaceState', 'popState'], 'history-pv')
        }
    }
}
