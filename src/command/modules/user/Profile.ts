import ExecutableCommand from "command/ExecutableCommand";
import AccessLevel from "user/AccessLevel";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";
import DBUserSchema from "database/schemas/DBUserSchema";
import SkillType from "user/skill/SkillType";

export default class Profile extends ExecutableCommand {
    public constructor() {
        super("profile", AccessLevel.UNREGISTERED, 0, "View your profile.");
    }
    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState): Promise<boolean> => {
            const userModel = new DBUserSchema().getModelForClass(DBUserSchema);
            const user = state.getMessageHandle().author;
            try {
                const doc = await state.getDbCore().getUserModel().findOne({id: user.id});
                if (!doc) {
                    state.getMessageHandle().reply(
                        `\`\`\`` +
                        `${user.username} - The unregistered.\n` +
                        `You are not registered. type "!f register" to register.` +
                        `\`\`\``,
                    );
                    return true;
                }
                const dbUser = await userModel.getUser(user.id);
                const dateDiff = (new Date() as any) - (dbUser.dateRegistered as any);
                const hours = dateDiff / (1000 * 60 * 60);
                state.getMessageHandle().reply(
                    `\`\`\`` +
                    `${user.username} - ${dbUser.title.all[dbUser.title.active]}\n` +
                    `Access Level: ${dbUser.accessLevel} (${AccessLevel[dbUser.accessLevel]})\n` +
                    `Wallet:\n` +
                    `   DotmaCoins: ${dbUser.wallet.dotmaCoin}\n` +
                    `   BradCoins: ${dbUser.wallet.bradCoin}\n` +
                    `Skills:\n` +
                    `   Thieving experience: ${await dbUser.getSkillExperience(SkillType.THIEVING)}\n` +
                    `   Thieving level: ${await dbUser.getSkillLevel(SkillType.THIEVING)}\n` +
                    `\n` +
                    `You have been registered for ${Math.round(hours)} hour(s).` +
                    `\`\`\``,
                );
                return true;
            } catch (err) {
                state.getMessageHandle().reply("Could not retrieve user data.");
                this.logger.warn(err);
                return false;
            }
        });
    }
}
