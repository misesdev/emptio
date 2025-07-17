import { AppResponse } from "../telemetry";
import { User } from "../user/types/User";

export type SignUpProps = {
    setUser: (user: User) => void;
    userName: string;
}

export type SignInProps = {
    setUser: (user: User) => void;
    secretKey: string;
}

export interface IAuthService {
    checkBiometrics(): Promise<boolean>;
    isLogged(): Promise<AppResponse<User|null>>;
    signUp(props: SignUpProps): Promise<AppResponse<User|null>>;
    signIn(props: SignInProps): Promise<AppResponse<User|null>>;
    signOut(): Promise<AppResponse<any>>;
}

