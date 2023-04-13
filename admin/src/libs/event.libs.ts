import * as Events from "events";

interface IEventLib {
    dispatchNotification(data: any): void;
    subscribeNotification(event: string,cb: any): void;
}
export const EventTags = {
    NOTIFICATION:"notification",
    AUTH:"auth",
    DIALOG:"dialog"
}
enum INotificationStatus {
    SUCCESS = "success",
    ERROR = "error"
}

export interface INotification {
    status: INotificationStatus;
    message: string | null;

}

class EventLibs {
    private events: any = {};

    constructor() {

    }


    dispatch(event: any,data: any){
        if(!this.events[event]) return;
        this.events[event].forEach((callback: any) => callback(data));
    }

    subscribe(event: any, callback: any){
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    }


}

const emitter = new EventLibs();

class EventLib implements IEventLib{

    dispatchNotification(data: any){emitter.dispatch(EventTags.NOTIFICATION,data)}
    subscribeNotification(cb: any){emitter.subscribe(EventTags.NOTIFICATION,cb)};

    dispatchAuth(data: any){emitter.dispatch(EventTags.AUTH,data)}
    subscribeAuth(cb: any){emitter.subscribe(EventTags.AUTH,cb)};

    dispatchAccountDialog(data: any){emitter.dispatch(EventTags.DIALOG,data)}
    subscribeAccountDialog(cb: any){emitter.subscribe(EventTags.DIALOG,cb)};

}

export default EventLib;
