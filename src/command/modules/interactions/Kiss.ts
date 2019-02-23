import { AccessLevel } from "user/AccessLevel";
import ExecutableCommand from "command/ExecutableCommand";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBUserSchema from "database/schemas/DBUserSchema";

/**
 * Allows a user to kiss another user :)
 * returns boolean indicating success of command.
 */
export default class Kiss extends ExecutableCommand {
    public constructor() {
        super("kiss", AccessLevel.REGISTERED, 1, "Attempt to kiss someone.", "!f kiss [target]");
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState) => {
            state.getMessageHandle().channel.reply(`( ˘ ³˘)♥ from <@!${state.getMessageHandle().author.id}>`);
                return true;
        });
    }
}
