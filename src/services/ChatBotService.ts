import * as ChatBot from "cleverbot.io";
import * as Discord from "discord.js";
import * as winston from "winston";
import Config from "config/Config";
import Logger from "log/Logger";
import OnMessageState from "state/OnMessageState";
import StringFunc from "utils/StringFunc";

export default class ChatBotService {

    private bot: ChatBot;

    private logger: winston.Logger = new Logger(this.constructor.name).getLogger();

    public constructor(config: typeof Config) {
        if (!config.Service.CHATBOT_API_KEY || !config.Service.CHATBOT_USER_ID || ! config.Service.CHATBOT_SESSION) {
            this.logger.warn("Failed to initialize chat service. Missing keys.");
            return;
        }
        this.bot = new ChatBot(config.Service.CHATBOT_USER_ID, config.Service.CHATBOT_API_KEY);
        this.bot.setNick(config.Service.CHATBOT_SESSION);
    }

    public async sendMessage(state: OnMessageState): Promise<boolean> {
        const m: Discord.Message = state.getMessageHandle();
        const str = StringFunc.removeStrBothEndsNoSpace(m.content, "mrfortnite");
        if (str.length === 0) {
            return false;
        }
        try {
            // TODO set as a toggle.
            // await m.channel.send(
            //     `${m.author.username}, *${m.content}*\n` +
            //     `${await this.getResponse(str)}`,
            // );
            await m.channel.send(`${await this.getResponse(str)}`);
            return true;
        } catch (err) {
            throw err;
        }
    }

    public getResponse(message: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.bot.create((errA) => {
                if (errA) {
                    return reject(errA);
                }
                this.bot.ask(message, (errB, res) => {
                    if (errB) {
                        return reject(errB);
                    }
                    return resolve(res);
                });
            });
        });
    }
}
