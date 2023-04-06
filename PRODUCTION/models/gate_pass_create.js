module.exports= function (sequelize, DataTypes) {
    const Gate_Pass_Create = sequelize.define('Gate_Pass_Create',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            field:'ID'
        },
        manv:{
            type:DataTypes.STRING,
            primaryKey:true,
            allowNull:false,
            field:'MANV'
        },
        tenBoPhan:{
            type:DataTypes.STRING,
            primaryKey:true,
            allowNull:false,
            field:'TENBOPHAN'
        },
        img:{
            type:DataTypes.STRING,
            primaryKey:true,
            allowNull:false,
            field:'IMG'
        },
        idGatePass:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            field:'ID_GATE_PASS'
        },

    },{
        tableName:'GATE_PASS_CREATE',
        timestamps: false,
		schema: 'prod'
    });
    return Gate_Pass_Create;
}