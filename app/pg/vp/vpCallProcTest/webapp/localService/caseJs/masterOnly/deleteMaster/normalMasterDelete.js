var inputInfo = {},
                vpMstList = [],
                vpSupplierList = [],
                vpItemList = [],
                vpManagerList = [];
                
inputInfo = {
    inputData: {
        vpMst: [],
        vpSupplier: [],
        vpItem: [],
        vpManager: [],
        user_id: "testerId",
        user_no: "testerNo"
    }
};                        

vpMstList.push({
     tenant_id: "L2100"
    ,company_code: "*"
    ,org_type_code: "BU"
    ,org_code: "BIZ00200"
    ,vendor_pool_code: "VP202011230TEST02"
    ,vendor_pool_local_name : "TEST1 LOCAL 01"
    ,vendor_pool_english_name : "TEST1 LOCAL EN 01"
    ,repr_department_code: "T222"                
    ,operation_unit_code : "RAW_MATERIAL"
    ,inp_type_code : "MBLMOB"
    ,mtlmob_base_code : "AMOUNT"
    ,regular_evaluation_flag : true
    ,industry_class_code : "AAAAA"
    ,sd_exception_flag : false
    ,vendor_pool_apply_exception_flag : false
    ,maker_material_code_mngt_flag : false
    ,domestic_net_price_diff_rate : 0.0
    ,dom_oversea_netprice_diff_rate : 0.0
    ,equipment_grade_code : "AAAAA"
    ,equipment_type_code : "AAAAA"
    ,vendor_pool_use_flag : true
    ,vendor_pool_desc : "AAAAA"
    ,vendor_pool_history_desc : "AAAAA"
    ,parent_vendor_pool_code : "VP201610260018"
    ,leaf_flag : true
    ,level_number : 3
    ,display_sequence : 0
    ,register_reason : "AAAAA"
    ,approval_number : "AAAAA"
    ,crud_type_code : "D"
});

inputInfo.inputData.vpMst = vpMstList;