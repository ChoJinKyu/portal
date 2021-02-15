using {op.Pu_Pr_Mst as prMst} from '../../../../../db/cds/op/pu/pr/OP_PU_PR_MST-model';
using {op.Pu_Pr_Dtl as prDtl} from '../../../../../db/cds/op/pu/pr/OP_PU_PR_DTL-model';

namespace op;
@path : '/op.PrCreateV4Service'
service PrCreateV4Service {
/*
    type SavedMaster : {
        tenant_id : String;
        company_code : String;
        pr_number: String;
        approval_flag: Boolean;
        approval_number: String;
        erp_interface_flag: Boolean;
        erp_pr_number: String;
        erp_pr_type_code: String;
        local_create_dtm: String;
        local_update_dtm: String;
        pr_create_status_code: String;
        pr_create_system_code: String;
        pr_header_text: String;
        pr_template_name: String;
        pr_template_number: String;
        pr_type_code: String;
        pr_type_code_2: String;
        pr_type_code_3: String;
        pr_type_name: String;
        pr_type_name_2: String;
        pr_type_name_3: String;
        request_date: String;
        requestor_department_code: String;
        requestor_department_name: String;
        requestor_empno: String;
        requestor_name: String;
    };
*/
    type SavedDetail : {
        tenant_id : String;
        company_code : String;
        pr_number : String;
        pr_item_number: String;
        org_type_code: String;
        org_code: String;
        buyer_empno: String;
        buyer_department_code: String;
        currency_code: String;
        estimated_price: String;
        material_code: String;
        material_group_code: String;
        pr_desc: String;
        pr_quantity: String;
        pr_unit: String;
        requestor_empno: String;
        requestor_name: String;
        delivery_request_date: String;
        purchasing_group_code: String;
        price_unit: String;
        pr_progress_status_code: String;
        remark: String;
        sloc_code : String;
        supplier_code : String;
        item_category_code : String;
        account_assignment_category_code : String;
        account_code : String;
        cctr_code : String;
        wbs_code : String;
        asset_number : String;
        order_number : String;
        org_name : String;
        org_name_desc : String;
        user_local_name : String;
    };

    type PrCreateSaveType : {
        tenant_id : String;
        company_code : String;
        pr_number: String;
        approval_flag: Boolean;
        approval_number: String;
        approval_contents: String;
        erp_interface_flag: Boolean;
        erp_pr_number: String;
        erp_pr_type_code: String;
        local_create_dtm: String;
        local_update_dtm: String;
        pr_create_status_code: String;
        pr_create_system_code: String;
        pr_header_text: String;
        pr_template_name: String;
        pr_template_number: String;
        pr_type_code: String;
        pr_type_code_2: String;
        pr_type_code_3: String;
        pr_type_name: String;
        pr_type_name_2: String;
        pr_type_name_3: String;
        requestor_department_code: String;
        requestor_department_name: String;
        requestor_empno: String;
        requestor_name: String;
        request_date: String;
        pr_desc: String;
        update_user_id: String;
        details:  array of SavedDetail;
    }

    type OutType {
        return_code : String(10);
        return_msg  : String(5000);
    }

    action SavePrCreateProc (inputData : PrCreateSaveType) returns array of OutType;

}