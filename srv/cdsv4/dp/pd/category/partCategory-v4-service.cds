namespace dp;
@path : '/dp.partCategoryV4Service'

service PartCategoryV4Service {

    type PdPartCategoryType : {
            tenant_id : String;
            category_group_code : String;
            category_code : String;
            parent_category_code : String;
            sequence : String;
            active_flag : String;
            update_user_id : String;
            crud_type_code : String;
    };

    type PdPartCategoryLngType : {
            tenant_id : String;
            category_group_code : String;
            category_code : String;
            langauge_cd : String;
            code_name : String;
            update_user_id : String;
            crud_type_code : String;
    };

    type PdpartCategoryActivityType : {
        tenant_id : String;
        activity_code : String;
        category_group_code : String;
        category_code : String;
        s_grade_standard_days : String;
        a_grade_standard_days : String;
        b_grade_standard_days : String;
        c_grade_standard_days : String;
        d_grade_standard_days : String;
        active_flag : String;
        update_user_id : String;
        crud_type_code : String;
    };

    type OutType : {
        return_code : String(2);
        return_msg  : String(5000);
    };

    type ProcInputType : {
        crud_type  : String(1);
        pdMst      : PdPartCategoryType;
        pdDtl      : array of PdPartCategoryLngType;
        pdSD       : array of PdpartCategoryActivityType;
    }

    action PdPartCategorySaveProc(inputData : ProcInputType) returns OutType;

}