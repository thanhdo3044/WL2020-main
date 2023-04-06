"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ProposalForm extends Model {}

    ProposalForm.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        guid: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        showMessages: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100400
        },
        factoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100000
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: true
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        modelName: "ProposalForm",
        tableName: "ProposalForm",
        timestamps: true,
        schema: "base"
    });

    return ProposalForm;
};