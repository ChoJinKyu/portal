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
    ,vendor_pool_code: "VP202011230TEST01"
    ,vendor_pool_local_name : "TEST LOCAL 01-3"
    ,vendor_pool_english_name : "TEST LOCAL EN 01-3"
    ,repr_department_code: "T111-1"                
    ,operation_unit_code : "RAW_MATERIAL-1"
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
    ,crud_type_code : "U"
});

inputInfo.inputData.vpMst = vpMstList;            

/*
vpSupplierList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP202011230TEST01"
    , supplier_code: 'DE01091600'
    ,supeval_target_flag: false
    ,supplier_op_plan_review_flag: false
    ,supeval_control_flag: false
    ,supeval_control_start_date: "20210104"
    ,supeval_control_end_date: "20211229"
    ,supeval_restrict_start_date: "20210104"
    ,supeval_restrict_end_date: "20211229"
    ,inp_code: "AAA"
    ,supplier_rm_control_flag: false
    ,supplier_base_portion_rate: 0.0
    ,vendor_pool_mapping_use_flag: true
    ,register_reason: "AAA"
    ,approval_number: "AAA"
    ,crud_type_code : "C"
});

vpSupplierList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP202011230TEST01"
    , supplier_code: "CN12341400"
    ,supeval_target_flag: false
    ,supplier_op_plan_review_flag: false
    ,supeval_control_flag: false
    ,supeval_control_start_date: "20210104"
    ,supeval_control_end_date: "20211229"
    ,supeval_restrict_start_date: "20210104"
    ,supeval_restrict_end_date: "20211229"
    ,inp_code: "AAA"
    ,supplier_rm_control_flag: false
    ,supplier_base_portion_rate: 0.0
    ,vendor_pool_mapping_use_flag: true
    ,register_reason: "AAA"
    ,approval_number: "AAA"
    ,crud_type_code : "R"
});

vpSupplierList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP202011230TEST01"
    , supplier_code: 'US02689500'
    ,supeval_target_flag: false
    ,supplier_op_plan_review_flag: false
    ,supeval_control_flag: false
    ,supeval_control_start_date: "20210104"
    ,supeval_control_end_date: "20211229"
    ,supeval_restrict_start_date: "20210104"
    ,supeval_restrict_end_date: "20211229"
    ,inp_code: "AAA"
    ,supplier_rm_control_flag: false
    ,supplier_base_portion_rate: 0.0
    ,vendor_pool_mapping_use_flag: true
    ,register_reason: "AAA"
    ,approval_number: "AAA"
    ,crud_type_code : "D"
});

inputInfo.inputData.vpSupplier = vpSupplierList;  
*/
          
//삭제
vpItemList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP202011230TEST01"
    , material_code: 'TCMACR0032'
    , crud_type_code : "D"
});

//삭제
vpItemList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP202011230TEST01"
    , material_code: 'TCMACR0013'
    , crud_type_code : "D"
});


//삭제
vpItemList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP202011230TEST01"
    , material_code: 'TCMACD0015'
    , crud_type_code : "D"
});

inputInfo.inputData.vpItem = vpItemList;            

//삭제 
vpManagerList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP202011230TEST01"
    , vendor_pool_person_empno: "5452"
    , crud_type_code : "D"
});

//삭제 
vpManagerList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP202011230TEST01"
    , vendor_pool_person_empno: '5460'
    , crud_type_code : "D"
});

//삭제 
vpManagerList.push({
    tenant_id: "L2100"
    , company_code: "*"
    , org_type_code: "BU"
    , org_code: "BIZ00200"
    , vendor_pool_code: "VP202011230TEST01"
    , vendor_pool_person_empno: '5480'
    , crud_type_code : "D"
});

inputInfo.inputData.vpManager = vpManagerList;