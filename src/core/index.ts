import { DefaultOptions, Options, Version } from "../types/index";

export default class Tracker {

    public data: Options;

    constructor(options: Options) {
        this.data = Object.assign(this.initDef(), options);
    }

    // 兜底
    private initDef(): DefaultOptions {
        return <DefaultOptions>{
            sdkVersion: Version.version,
            historyTracker: false,
            hashTracker: true,
            domTracker: false,
            jsError: false
        }
    }
}
