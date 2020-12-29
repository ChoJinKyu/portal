//https://lgcommondev-workspaces-ws-xqwd6-app1.jp10.applicationstudio.cloud.sap/odata/v4/pg.vpMappingV4Service/VpMappingChangeProcCall
//https://lgcommondev2-workspaces-ws-9qpwg-app1.jp10.applicationstudio.cloud.sap/odata/v4/pg.vpMappingV4Service/VpMappingChangeProcCall
//https://lgcommondev2-workspaces-ws-9qpwg-app1.jp10.applicationstudio.cloud.sap/odata/v4/pg.vpMappingV4Service/VpMappingChangeTestProc


//using { pg as vpMstType } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MST_TYPE-model';
//using { pg as vpSupplierType } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_SUPPLIER_TYPE-model';
//using { pg as vpItemType } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_ITEM_TYPE-model';
//using { pg as vpManagerType } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MANAGER_TYPE-model';
//using { pg as vpOutType } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_PROC_OUT_TYPE-model';

namespace pg;

@path : '/pg.VpMappingV4Service'
service VpMappingV4Service {

    type VpMstType : {
        tenant_id                        : String(5);
        company_code                     : String(10);
        org_type_code                    : String(2);
        org_code                         : String(10);
        vendor_pool_code                 : String(20);
        vendor_pool_local_name           : String(240);
        vendor_pool_english_name         : String(240);
        repr_department_code             : String(50);
        operation_unit_code              : String(30);
        inp_type_code                    : String(30);
        mtlmob_base_code                 : String(30);
        regular_evaluation_flag          : Boolean;
        industry_class_code              : String(30);
        sd_exception_flag                : Boolean;
        vendor_pool_apply_exception_flag : Boolean;
        maker_material_code_mngt_flag    : Boolean;
        domestic_net_price_diff_rate     : Decimal;
        dom_oversea_netprice_diff_rate   : Decimal;
        equipment_grade_code             : String(30);
        equipment_type_code              : String(30);
        vendor_pool_use_flag             : Boolean;
        vendor_pool_desc                 : String(3000);
        vendor_pool_history_desc         : String(3000);
        parent_vendor_pool_code          : String(20);
        leaf_flag                        : Boolean;
        level_number                     : Decimal;
        display_sequence                 : Integer64;
        register_reason                  : String(50);
        approval_number                  : String(50);
        crud_type_code                   : String(2);
    };

    type VpSuppilerType : {
        tenant_id                    : String(5);
        company_code                 : String(10);
        org_type_code                : String(2);
        org_code                     : String(10);
        vendor_pool_code             : String(20);
        supplier_code                : String(15);
        supeval_target_flag          : Boolean;
        supplier_op_plan_review_flag : Boolean;
        supeval_control_flag         : Boolean;
        supeval_control_start_date   : String(8);
        supeval_control_end_date     : String(8);
        supeval_restrict_start_date  : String(8);
        supeval_restrict_end_date    : String(8);
        inp_code                     : String(30);
        supplier_rm_control_flag     : Boolean;
        supplier_base_portion_rate   : Decimal;
        vendor_pool_mapping_use_flag : Boolean;
        register_reason              : String(50);
        approval_number              : String(50);
        crud_type_code               : String(2);
    };

    type VpItemType : {
        tenant_id                    : String(5);
        company_code                 : String(10);
        org_type_code                : String(2);
        org_code                     : String(10);
        vendor_pool_code             : String(20);
        material_code                : String(40);
        vendor_pool_mapping_use_flag : Boolean;
        register_reason              : String(50);
        approval_number              : String(50);
        crud_type_code               : String(2);
    };

    type VpManagerType : {
        tenant_id                    : String(5);
        company_code                 : String(10);
        org_type_code                : String(2);
        org_code                     : String(10);
        vendor_pool_code             : String(20);
        vendor_pool_person_empno     : String(30);
        vendor_pool_person_role_text : String(50);
        vendor_pool_mapping_use_flag : Boolean;
        register_reason              : String(50);
        approval_number              : String(50);
        crud_type_code               : String(2);
    };

    type VpOutType : {
        return_code : String(2);
        return_msg  : String(5000);
    };

    type ProcInputType : {
        vpMst      : array of VpMstType;
        vpSupplier : array of VpSuppilerType;
        vpItem     : array of VpItemType;
        vpManager  : array of VpManagerType;
        user_id    : String(255);
        user_no    : String(255)
    }

    action VpMappingChangeProc(inputData : ProcInputType) returns array of VpOutType;

    action VpMappingChangeTestProc(inputData : ProcInputType) returns array of VpOutType;


}
