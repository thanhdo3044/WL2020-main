module.exports= function (sequelize, DataTypes) {
    const Gate_Pass = sequelize.define('Gate_Pass',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            field:'ID'
        },
        created_at:{
            type:DataTypes.DATEONLY,
            allowNull:false,
            field:'CREATED_AT'
        },
        gate_pass_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            field:'GATE_PASS_ID'
        },
        location_comany:{
            type:DataTypes.STRING,
            allowNull:false,
            field:'LOCATION_COMPANY'
        },
        ballot_number:{
            type:DataTypes.STRING,
            allowNull:false,
            field:'BALLOT_NUMBER'
        },
        contract_number:{
            type:DataTypes.STRING,
            allowNull:false,
            field:'CONTRACT_NUMBER'
        },
        customer_or:{
            type:DataTypes.STRING,
            allowNull:false,
            field:'CUSTOMER_OR_CUSTOMER'
        },
        customer_address:{
            type:DataTypes.STRING,
            allowNull:false,
            field:'CUSTOMER_ADDRESS'
        },
    },{
        tableName:'GATE_PASS',
        timestamps: false,
		schema: 'prod'
    });
    return Gate_Pass;
}