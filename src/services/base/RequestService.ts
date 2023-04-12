import {Express, IRouter} from "express";

class RequestService {

    private router: IRouter;
    private request: any;
    private response: any;

    constructor(router: IRouter) {
        this.router = router;
        this.router.use((req: any, res: any, next: any) => {
            this.request = req;
            this.response = res;
            next();
        })

    }

    updateRequest(key: string, value: string, baseName = "custom") {
        if (!this.request[baseName]) {
            this.request[baseName] = {};
        }
        this.request[baseName][key] = value;
    }

    getOrCreateNewObject(key: string, baseName = "custom") {
        if (!this.request[baseName]) {
            this.request[baseName] = {};
        }
        if (!this.request[baseName][key]) {
            this.request[baseName][key] = {};
        }
        return this.request[baseName][key];
    }

    getDataBag() {
        return this.getOrCreateNewObject('data-bag');
    }

    addToDataBag(key: any, value: any) {

        this.response.locals[key] = value;
    }

    getFromDataBag(key: any) {
        return this.response.locals[key];
    }

    getUser() {
        return this.response.locals._user;
    }

    setUser(user: any){
        this.response.locals._user = user;
        return;
    }

    setJWT(jwt: any){
        this.response.locals._jwt = jwt;
        return;
    }

    getJWT(){
        return this.response.locals._jwt;
    }
    setTokenData(tokenData){
        this.response.locals._tdata= tokenData;
        return;
    }

    getTokenData(){
        return this.response.locals._tdata
    }

    hasUser() {
        const bag = this.getOrCreateNewObject('data-bag');
        return (bag._user);
    }

    setLoggingSession(login_session: any){
        this.response.locals._login_session = login_session;
        return this;
    }

    getLoggingSession(){
        return this.response.locals._login_session;
    }


}

export default RequestService;
