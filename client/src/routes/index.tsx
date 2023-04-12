import {useContext} from "react";
import {BaseProvider} from "../providers/base.provider";
import {IUserAuth} from "../hooks/useAuth";

import {Route, Routes, useRoutes} from "react-router-dom";
import Protected from "./protected";
import PublicHidden from "./public";


export const AppRoutes = () => {
    const {useAuth} = useContext(BaseProvider);
    const {isAuthorized}:IUserAuth = useAuth;
    return(
        <Routes>
            {/*<Route element={<PublicHidden isSignedIn={isAuthorized}><Login /></PublicHidden>} path={'/auth/login'} />*/}
            {/*<Route element={<PublicHidden isSignedIn={isAuthorized}><Signup /></PublicHidden>} path={'/auth/signup'} />*/}
            {/*<Route element={<Protected isSignedIn={isAuthorized}><Dashboard /></Protected>} path={'/app/dashboard'} />*/}
            {/*<Route element={<Home />} path={'/'} />*/}
            {/*<Route element={<_404 />} path={'*'} />*/}
        </Routes>
    )
}
