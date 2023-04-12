import {useAxios} from "../../../hooks/useAxios";
import {Axios,AxiosInstance} from "axios";


export class Api {
    private api: AxiosInstance;
    constructor() {
        this.api = useAxios().api;
    }


    get = async (path: string,cb: any) => {
        try{
            let _data = await this.api.request({
                url: path,
                method: "GET",
            })
            cb(null,_data)
        }catch (e) {
            cb(e,null);
        }
    }

    post = async (path: string,data: any,cb: any) => {
        try{
            let _data = await this.api.request({
                url: path,
                method: "POST",
                data: data
            })
            cb(null,_data)
        }catch (e) {
            cb(e,null);
        }
    }
}