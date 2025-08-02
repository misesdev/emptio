import { AppResponse } from "../telemetry";
import { User } from "../user/types/User";

export interface IAuthService {
    checkBiometrics(): Promise<boolean>;
    isLogged(): Promise<AppResponse<User|null>>;
    signUp(userName: string): Promise<AppResponse<User|null>>;
    signIn(secretKey: string): Promise<AppResponse<User|null>>;
    signOut(): Promise<AppResponse<any>>;
}

