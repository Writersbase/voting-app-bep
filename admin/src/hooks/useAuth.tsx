
import store from 'store';
import {useEffect, useState} from "react";
export interface IUserAuth {
    token: string | null;
    isAuthorized: boolean;
    clearStoreToken: any;
    setStoreToken: any
}
const preloadStorage = () => {
    const authPreload = store.get('isAuth');
    if(authPreload == 1){
        return true;
    }else{
        return false
    }
}

const loadToken = () => {
    const getToken = store.get('token');
    if(getToken && getToken.length > 15){
        return getToken;
    }else{
        return null;
    }
}
export const useAuth = () : IUserAuth => {

    const [token,setToken] = useState<string | null>(loadToken);
    const [isAuthorized,setIsAuthorized] = useState<boolean>(preloadStorage);


    useEffect(() => {
       setToken(loadToken)
    },[token])

    useEffect(() => {
        setIsAuthorized(preloadStorage)
    },[isAuthorized])


    const setStoreToken = (_token: string): void => {
        store.set('token',_token.toString());
        store.set('isAuth',1);
        setToken(_token);
        setIsAuthorized(true);
        console.log(isAuthorized)
    }


    const clearStoreToken = () => {
        store.clearAll();
        setToken(null);
        setIsAuthorized(false);
    }




    return {token,isAuthorized,setStoreToken,clearStoreToken};
}