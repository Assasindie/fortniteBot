import * as winston from "winston";
import Logger from "log/Logger";

export default class PrefixManager {
    /**
     * An array of prefixes accepted by the bot.
     */
    private prefixes: string[];
    private logger: winston.Logger = new Logger(this.constructor.name).getLogger();
    /**
     * @classdesc Initial configuration for commands.
     * @param prefix - The array of prefixes used to call commands.
     */
    public constructor(prefixes: string[]) {
        this.logger.debug("Prefix Manager created.");
        this.prefixes = [];
        for (const prefix of prefixes) {
            this.addPrefix(prefix);
        }
    }

    /**
     * Adds a prefix.
     * @param prefix - The prefix to add.
     * @returns true if successfully added.
     */
    public addPrefix(prefix: string): boolean {
        if (this.prefixes.indexOf(prefix) === -1) {
            this.prefixes.push(prefix);
            this.logger.info(`Prefix "${prefix}" loaded.`);
            return true;
        }
        this.logger.info(`Failed to load "${prefix}" duplicate.`);
        return false;
    }

    /**
     * Removes a prefix.
     * @param prefix - The prefix to remove.
     * @returns true if successfully removed.
     */
    public removePrefix(prefix: string): boolean {
        const index = this.prefixes.indexOf(prefix);
        if (index > -1) {
            this.prefixes.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * @return The array of prefixes.
     */
    public getPrefixes(): string[] {
        return this.prefixes;
    }
}
