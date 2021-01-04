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

//VP201610260092의 Supplier데이터 존재함.
vpMstList.push({
        tenant_id: "L2100"
    ,company_code: "*"
    ,org_type_code: "BU"
    ,org_code: "BIZ00200"
    ,vendor_pool_code: "VP201610260092"                
    ,vendor_pool_local_name : "GAS_Others1"
    ,vendor_pool_english_name : "GAS_Others2"
    ,repr_department_code: "B234"                
    ,operation_unit_code : "RAW_MATERIAL1"
    ,inp_type_code : "MBLMOB1"
    ,mtlmob_base_code : "AMOUNT1"
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
           