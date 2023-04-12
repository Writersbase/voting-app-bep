
import axios, {InternalAxiosRequestConfig} from "axios"

import {useContext} from "react";
import {BaseProvider} from "../providers/base.provider";
import {IUserAuth} from "./useAuth";




export const useAxios = () => {

    const {useAuth} = useContext(BaseProvider);
    const {token}:IUserAuth = useAuth;
    const api = axios.create({
        baseURL: "https://tasty-be.herokuapp.com/api/v1",
    })

    const errorHandler = (error: any) => {
        const statusCode = error.response?.status

        // logging only errors that are not 401
        if (statusCode && statusCode !== 401) {
            console.error(error)
        }

        return Promise.reject(error)
    }


    api.interceptors.response.use(undefined, (error) => {
        return errorHandler(error)
    })

    api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        config.headers['Authorization'] = token?.toString()
        return config;
    }, (error) => {
        return errorHandler(error)
    })


    return {api};
}
