import {createSearchParams, useLocation, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {BaseProvider} from "../providers/base.provider";


export const useUtils = () => {
    const {events} = useContext(BaseProvider);
    const navigation = useNavigate();
    const location = useLocation();
    const handleMenuDialog = (query_address: any):void => {
        navigation({
            pathname: location.pathname,
            search: createSearchParams({
                menu:query_address.toString()
            }).toString()
        });
        events.dispatchAccountDialog();
    }
    return {handleMenuDialog}
}
