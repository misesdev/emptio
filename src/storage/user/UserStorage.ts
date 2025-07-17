import { User } from "@services/user/types/User";
import { ItemStorage } from "../base/ItemStorage";

export class UserStorage extends ItemStorage<User> 
{
    constructor() {
        super("userdata", null)
    }
}
