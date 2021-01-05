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
    ,vendor_pool_code: "VP201610280406"                
    ,vendor_pool_local_name : "Edge Inking1"
    ,vendor_pool_english_name : "Edge Inking1"
    ,repr_department_code: null
    ,operation_unit_code : "EQUIPMENT"
    ,inp_type_code : "MBLMOB"
    ,mtlmob_base_code : null
    ,regular_evaluation_flag : true
    ,industry_class_code : 'INDUSTRY000007'
    ,sd_exception_flag : true
    ,vendor_pool_apply_exception_flag : false
    ,maker_material_code_mngt_flag : false
    ,domestic_net_price_diff_rate :null
    ,dom_oversea_netprice_diff_rate : null
    ,equipment_grade_code : "D"
    ,equipment_type_code : 'DEFFERENCIATION'
    ,vendor_pool_use_flag : true
    ,vendor_pool_desc : "AAAAA"
    ,vendor_pool_history_desc : null
    ,parent_vendor_pool_code : 'VP201610280034'
    ,leaf_flag : true
    ,level_number : 3
    ,display_sequence : null
    ,register_reason : null
    ,approval_number : null
    ,crud_type_code : "U"
});

inputInfo.inputData.vpMst = vpMstList;            

vpSupplierList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP201610280406"
    , supplier_code: "KR01817003"
    ,supeval_target_flag: null
    ,supplier_op_plan_review_flag: null
    ,supeval_control_flag: null
    ,supeval_control_start_date: "20201229"
    ,supeval_control_end_date: "20211229"
    ,supeval_restrict_start_date: "20201229"
    ,supeval_restrict_end_date: "20211229"
    ,inp_code: null
    ,supplier_rm_control_flag: null
    ,supplier_base_portion_rate: null
    ,vendor_pool_mapping_use_flag: true
    ,register_reason: null
    ,approval_number: null
    ,crud_type_code : "U"
});

vpSupplierList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP201610280406"
    , supplier_code: 'KR01812500'
    ,supeval_target_flag: null
    ,supplier_op_plan_review_flag: null
    ,supeval_control_flag: null
    ,supeval_control_start_date: "20200104"
    ,supeval_control_end_date: "20211226"
    ,supeval_restrict_start_date: "20200104"
    ,supeval_restrict_end_date: "20211226"
    ,inp_code: null
    ,supplier_rm_control_flag: null
    ,supplier_base_portion_rate: null
    ,vendor_pool_mapping_use_flag: true
    ,register_reason: null
    ,approval_number: null
    ,crud_type_code : "U"
});

vpSupplierList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP201610280406"
    , supplier_code: 'KR01818600'
    ,supeval_target_flag: null
    ,supplier_op_plan_review_flag: null
    ,supeval_control_flag: null
    ,supeval_control_start_date: "20210104"
    ,supeval_control_end_date: "20211228"
    ,supeval_restrict_start_date: "20210104"
    ,supeval_restrict_end_date: "20211228"
    ,inp_code: null
    ,supplier_rm_control_flag: null
    ,supplier_base_portion_rate: null
    ,vendor_pool_mapping_use_flag: true
    ,register_reason: null
    ,approval_number: null
    ,crud_type_code : "U"
});



inputInfo.inputData.vpSupplier = vpSupplierList;