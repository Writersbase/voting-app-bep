import BaseControllerClass from "../../base/BaseControllerClass";
import UserService from "../../../services/UserService";
import {METHOD} from "../../../constants/AppConstants";


class AccountController extends BaseControllerClass {

    constructor() {
        super();

    }

    protected initMiddleware(): void {

    }

    protected initRoutes(): void {
        this.profile();
    }

    protected initServices(): void {

    }

    profile(){
        this.router.get('/',async (req,res) => {
            const user = this.requestService.getUser();
            try{
                let userInfo = await this.userService.findOne({email: user?.email},null)
                if(userInfo){
                    return this.sendSuccessResponse(res,this.userService.getSafeUserData(userInfo))
                }else {
                    const error = new this.AppError({path:'/account/',method:METHOD.POST,message:"profile not found.",collection:"user"})
                    return this.sendErrorResponse(res,error,this.errorResponseMessage.USER_NOT_FOUND,400)
                }
            }catch (e) {
                return this.sendErrorResponse(res,e,this.errorResponseMessage.USER_NOT_FOUND,400)
            }
        })
    }

}


export default  new AccountController().router;
