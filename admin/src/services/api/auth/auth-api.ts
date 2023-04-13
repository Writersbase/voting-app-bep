import {useAxios} from "../../../hooks/useAxios";



interface IRegister {
    email: string;
    password: string;
    username: string;
}


interface ILogin {
    email: string;
    password: string;
}


export const authApi = () => {
    const {api} = useAxios();
    const signup = async (data: IRegister,cb: any) => {
        try{
            let _data = await api.request({
                url: '/auth/signup',
                method: "POST",
                data: data
            })
            cb(false,_data.data.data)
        }catch (e) {
            cb(e,false);
        }
    }

    const login = async (data: ILogin,cb: any) => {
        try{
            let _data = await api.request({
                url: '/auth/signin',
                method: "POST",
                data: data
            })
            cb(false,_data.data.data)
        }catch (e) {
            cb(e,false);
        }
    }

    return {signup,login}
}


