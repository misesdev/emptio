import { User } from "../../user/types/User";
import { ItemStorage } from "../base/ItemStorage";

export class UserStorage extends ItemStorage<User> 
{
    constructor() {
        super("userdata")
    }
}
