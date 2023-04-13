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


export const accountApi = () => {
    const {api} = useAxios();
    const getProfileInformation = async (token: string,cb: any) => {
        try{
            let _data = await api.request({
                url: '/user/account/',
                method: "GET",

            })
            cb(false,_data.data.data)
        }catch (e) {
            cb(e,false);
        }
    }

    // const login = async (data: ILogin,cb: any) => {
    //     try{
    //         let _data = await api.request({
    //             url: '/auth/signin',
    //             method: "POST",
    //             data: data
    //         })
    //         cb(false,_data.data.data)
    //     }catch (e) {
    //         cb(e,false);
    //     }
    // }

    return {getProfileInformation}
}


