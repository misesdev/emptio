import ReactNativeBiometrics from "react-native-biometrics";
import { IAuthService, SignInProps, SignUpProps } from "./IAuthService";
import { AppResponse, trackException } from "../telemetry";
import { User } from "../user/types/User";
import NostrPairKey from "../nostr/pairkey/NostrPairKey";
import { PrivateKeyStorage } from "@storage/pairkeys/PrivateKeyStorage";
import UserService from "../user/UserService";
import NoteService from "../nostr/note/NoteService";
import { EventKinds } from "@src/constants/Events";
import { UserStorage } from "@storage/user/UserStorage";
import { useTranslate } from "../translate/TranslateService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EncryptedStorage from "react-native-encrypted-storage";
import { DBEvents } from "@/src/storage/database/events";

export class AuthService implements IAuthService 
{
    private readonly _noteService: NoteService;
    private readonly _userStorage: UserStorage;
    private readonly _privatekey: PrivateKeyStorage;
    private readonly _biometrics: ReactNativeBiometrics;

    constructor() {
        this._noteService = new NoteService()
        this._userStorage = new UserStorage()
        this._biometrics = new ReactNativeBiometrics()
        this._privatekey = new PrivateKeyStorage()
    }

    public async checkBiometrics(): Promise<boolean> {
        const { available } = await this._biometrics.isSensorAvailable()
        if(available) {
            const { success } = await this._biometrics.simplePrompt({
                promptMessage: await useTranslate("commons.authenticate.message")
            })
            return success
        }
        return false
    }

    public async signUp({ setUser, userName }: SignUpProps): Promise<AppResponse<User | null>> {
        try {
            const pairkey = NostrPairKey.create()
            const stored = await this._privatekey.add(pairkey.getPrivateKey())
            const profile: User = {
                name: userName.trim(),
                display_name: userName.trim(),
                pubkey: pairkey.getPublicKeyHex(),
                keychanges: stored.id 
            }
            const userService = new UserService(profile)
            await userService.publishProfile()
            await userService.save()
            if (setUser) 
                setUser(profile)
            return { success: true, data: profile }
        } catch(ex) {
            return trackException(ex, null)
        }
    }

    public async signIn({ setUser, secretKey }: SignInProps): Promise<AppResponse<User|null>> {
        try {  
            const pairkey = NostrPairKey.fromNsec(secretKey)
            const stored = await this._privatekey.add(pairkey.getPrivateKey())
            const event = await this._noteService.getNote({
                authors: [pairkey.getPublicKeyHex()], 
                kinds: [EventKinds.metadata], 
                limit: 1 
            })
            if(!event) throw new Error("profile event not found")
            const profile = JSON.parse(event.content) as User
            profile.keychanges = stored.id
            profile.pubkey = event.pubkey
            
            const userService = new UserService(profile)
            await userService.publishProfile()
            await userService.save()
            if (setUser) 
                setUser(profile)
            return { success: true, data: profile }
        } catch(ex) {
            return trackException(ex)
        }
    }

    public async isLogged(): Promise<AppResponse<User|null>> {
        try {
            const profile = await this._userStorage.get()
            if(!profile) 
                return { success: false, data: null }
            const privateKey = await this._privatekey.get(profile.keychanges)
            if(!privateKey) 
                return { success: false, data: null }
            const pairkey = new NostrPairKey(privateKey)
            profile.pubkey = pairkey.getPublicKeyHex()
            return { success: true, data: profile }
        } catch(ex) {
            return trackException(ex)
        }
    }

    public async signOut(): Promise<AppResponse<any>> {
        try {
            await DBEvents.clear()
            await AsyncStorage.clear()
            await EncryptedStorage.clear()
            return { success: true }
        } catch(ex) {
            return trackException(ex)
        }
    }
}
