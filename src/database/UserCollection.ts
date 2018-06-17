import * as MongoDb from "mongodb";
import { DatabaseException } from "../exceptions/DatabaseException";
import { FrotniteBotCollection } from "./FortniteBotCollection";
import { ICollection } from "./ICollection";
import { User } from "../user/User";

export class UserCollection extends FrotniteBotCollection implements ICollection {
    private localDb: any;
    constructor(localDb: any) {
        super();
        this.localDb = localDb;
    }
    public add(user: User, callback: (res: boolean) => void): void {
        this.db.collection("user").insert(user, (err) => {
            if (err) {
                callback(false);
                throw new DatabaseException(err);
            }
            callback(true);
        });
    }
    public get(callback: (res: any[]) => void): void {
        this.db.collection("user").find({}).toArray().then((res: any) => {
            callback(res);
        });
    }
    public update(userId: string, field: string, value: any,
                  callback: (res: boolean) => void): void {
        const set = {field: value};
        set[field] = value;
        this.db.collection("user").update({id: userId},
            {$set: set}, (err) => {
            if (err) {
                callback(false);
                throw new DatabaseException(err);
            }
            callback(true);
        });
    }
    public removeUser(userId: string, callback: (res: boolean) => void): void {
        this.db.collection("user").deleteOne({id: userId}, (err) => {
            if (err) {
                callback(false);
                throw new DatabaseException(err);
            }
            callback(true);
        });
    }
}
