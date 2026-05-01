import { createDecipheriv } from "node:crypto";
import { create } from "node:domain";
import { get } from "node:http";
import { DataTypes } from "sequelize";

export default function model(sequelize: any) {
    const attributes = {
        token: { type: DataTypes.STRING},
        expires: { type: DataTypes.DATE },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        createdByIp: { type: DataTypes.STRING },
        replacedByToken: { type: DataTypes.STRING },
        isExpired: {
            type: DataTypes.VIRTUAL,
            get () { return Date.now() >= this.expires; }
        },
        isActive: {
            type: DataTypes.VIRTUAL,
            get () { return !this.isrevoked && !this.isExpired; }
        }
    };

    const options = {
        timeStamp: false,
    };
    return sequelize.define('RefreshToken', attributes, options);
}