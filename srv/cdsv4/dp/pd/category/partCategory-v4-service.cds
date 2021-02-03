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

    type OutType : {
        return_code : String(2);
        return_msg  : String(5000);
    };

    type ProcInputType : {
        crud_type  : String(1);
        pdMst      : PdPartCategoryType;
        pdDtl      : array of PdPartCategoryLngType;
    }

    action PdPartCategorySaveProc(inputData : ProcInputType) returns OutType;

}