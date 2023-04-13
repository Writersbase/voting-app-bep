import {useEffect, useState} from "react";


export const useLoader = () => {

    const [loader,setLoader] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoader(false);
        },4000);
    });

    return {loader};
}
