import * as Mongoose from "mongoose";
import { Typegoose, prop, arrayProp, instanceMethod } from "typegoose";
import Brad from "entities/Brad";
import Config from "config/Config";
import { core } from "core/NikkuCore";

export class IdContributionPair {
    public id: string;
    public contribution: number;
    public constructor(id: string, contribution: number) {
        this.id = id;
        this.contribution = contribution;
    }
}

export default class DBBradPropertySchema extends Typegoose {
    @prop({required: true, default: Config.Brad.DEFAULT_WEIGHT})
    public weight: number;

    @prop({required: true, default: Config.Brad.DEFAULT_WEIGHT + 1})
    public weightGoal: number;

    @arrayProp({default: [], items: IdContributionPair})
    public contributors: IdContributionPair[];

    @arrayProp({default: [], items: IdContributionPair})
    public contributorsAllTime: IdContributionPair[];

    @instanceMethod
    public async incrementWeight(this: InstanceType<any> & Mongoose.Document, id: string, amount: number): Promise<void> {
       try {
            const index = this.contributors.findIndex((u: IdContributionPair) => u.id === id);
            if (index === -1) {
                this.contributors.push(new IdContributionPair(id, amount));
            } else {
                this.contributors[index].contribution += amount;
            }
            const indexAll = this.contributorsAllTime.findIndex((u: IdContributionPair) => u.id === id);
            if (indexAll === -1) {
                this.contributorsAllTime.push(new IdContributionPair(id, amount));
            } else {
                this.contributorsAllTime[indexAll].contribution += amount;
            }
            this.weight += parseFloat(Brad.dotmaCoinsToKg(amount).toFixed(4));
            await this.markModified("contributors");
            await this.markModified("contributorsAllTime");
            core.setActivity(`Brad's Weight: ${this.weight.toFixed(4)}kg`);
            return await this.save();
        } catch (err) {
            throw err;
        }
    }

    @instanceMethod
    public async setNewWeightGoal(this: InstanceType<any> & Mongoose.Document): Promise<void> {
       try {
            this.weightGoal = Math.floor(this.weight) + 1;
            return await this.save();
        } catch (err) {
            throw err;
        }
    }

    @instanceMethod
    public async resetCurrentRun(this: InstanceType<any> & Mongoose.Document): Promise<void> {
        try {
             this.contributors = [];
             await this.markModified("contributors");
             return await this.save();
         } catch (err) {
             throw err;
         }
     }
}
