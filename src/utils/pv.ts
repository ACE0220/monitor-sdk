export const createHistoryEvent = <T extends keyof History>(type:T) => {
    const origin = history[type];
    return function(this: any) { // this是一个假参数，不需要传进来，另外一个解决方式是去tsconfig.json将noImplicitAny设置为false
        const res = origin.apply(this, arguments);
        // 创建最定义事件
        const e = new Event(type);
        window.dispatchEvent(e);
        return res;
    }
}