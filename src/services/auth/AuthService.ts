import ReactNativeBiometrics from "react-native-biometrics";
import { IAuthService } from "./IAuthService";
import { AppResponse, trackException } from "../telemetry";
import NostrPairKey from "../nostr/pairkey/NostrPairKey";
import { PrivateKeyStorage } from "@storage/pairkeys/PrivateKeyStorage";
import UserService from "../user/UserService";
import NoteService from "../nostr/note/NoteService";
import { EventKinds } from "@src/constants/Events";
import { UserStorage } from "@storage/user/UserStorage";
import { useTranslate } from "../translate/TranslateService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EncryptedStorage from "react-native-encrypted-storage";
import { DataBaseEvents } from "@storage/database/DataBaseEvents";
import useNDKStore, { NDKStore } from "../zustand/useNDKStore";
import { DataBaseTransaction } from "@storage/database/DataBaseTransaction";
import { DataBaseUtxo } from "@storage/database/DataBaseUtxo";
import { User } from "../user/types/User";

class AuthService implements IAuthService 
{
    private readonly _dbUtxos: DataBaseUtxo;
    private readonly _dbEvents: DataBaseEvents;
    private readonly _dbTransactions: DataBaseTransaction;
    private readonly _noteService: NoteService;
    private readonly _userStorage: UserStorage;
    private readonly _privatekey: PrivateKeyStorage;
    private readonly _biometrics: ReactNativeBiometrics;
    private readonly _ndkStore: NDKStore;

    constructor(
        ndkStore: NDKStore = useNDKStore.getState(),
        userStorage: UserStorage = new UserStorage(),
        noteService: NoteService = new NoteService(),
        biometrics: ReactNativeBiometrics = new ReactNativeBiometrics(),
        privatekey: PrivateKeyStorage = new PrivateKeyStorage(),
        dbEvents: DataBaseEvents = new DataBaseEvents(),
        dbTransactios: DataBaseTransaction = new DataBaseTransaction(),
        dbUtxos: DataBaseUtxo = new DataBaseUtxo()
    ) {
        this._ndkStore = ndkStore
        this._noteService = noteService
        this._userStorage = userStorage
        this._biometrics = biometrics
        this._privatekey = privatekey
        this._dbTransactions = dbTransactios
        this._dbEvents = dbEvents
        this._dbUtxos = dbUtxos
    }

    public async checkBiometrics(): Promise<boolean> 
    {
        try {
            const { available } = await this._biometrics.isSensorAvailable()
            if(available) {
                const { success } = await this._biometrics.simplePrompt({
                    promptMessage: await useTranslate("commons.authenticate.message")
                })
                return success
            }
        } 
        catch(ex) { 
            trackException(ex)
        }
        return true
    }

    public async signUp(userName: string): Promise<AppResponse<User | null>> 
    {
        try {
            const pairkey = NostrPairKey.create()
            const stored = await pairkey.save() 
            const profile: User = {
                name: userName.trim(),
                display_name: userName.trim(),
                pubkey: pairkey.getPublicKeyHex(),
                keyRef: stored.id 
            }
            await this._ndkStore.setNdkSigner(profile)
            const userService = new UserService(profile)
            await userService.publishProfile()
            const followsEvent = userService.createFollows([
                ["p", "55472e9c01f37a35f6032b9b78dade386e6e4c57d80fd1d0646abb39280e5e27"]
            ])
            await userService.updateFollows(followsEvent)
            await userService.save()
            return { success: true, data: profile }
        } catch(ex) {
            return trackException(ex, null)
        }
    }

    public async signIn(secretKey: string): Promise<AppResponse<User|null>> 
    {
        try {  
            const pairkey = NostrPairKey.fromNsec(secretKey)
            const stored = await pairkey.save() 
            const event = await this._noteService.getNote({
                authors: [pairkey.getPublicKeyHex()], 
                kinds: [EventKinds.metadata], 
                limit: 1 
            })
            if(!event)
                throw new Error("profile not found")
            const profile = JSON.parse(event.content) as User
            profile.pubkey = event.pubkey
            profile.keyRef = stored.id
            
            await this._ndkStore.setNdkSigner(profile)
            const userService = new UserService(profile)
            await userService.publishProfile()
            await userService.save()
            return { success: true, data: profile }
        } catch(ex) {
            return trackException(ex)
        }
    }

    public async isLogged(): Promise<AppResponse<User|null>> 
    {
        try {
            const profile = await this._userStorage.get()
            if(!profile) 
                return { success: false, data: null }
            const privateKey = await this._privatekey.get(profile.keyRef)
            if(!privateKey) 
                return { success: false, data: null }
            const pairkey = new NostrPairKey(privateKey.entity)
            profile.pubkey = pairkey.getPublicKeyHex()
            await this._ndkStore.setNdkSigner(profile)
            return { success: true, data: profile }
        } catch(ex) {
            return trackException(ex)
        }
    }

    public async signOut(): Promise<AppResponse<any>> 
    {
        try {
            await this._dbEvents.clear()
            await this._dbTransactions.clear()
            await this._dbUtxos.clear()
            await EncryptedStorage.clear()
            await AsyncStorage.clear()
            return { success: true }
        } catch(ex) {
            return trackException(ex)
        }
    }
}

export default AuthService
