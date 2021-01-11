using {op.Pu_Pr_Mst as prMst} from '../../../../../db/cds/op/pu/pr/OP_PU_PR_MST-model';
using {op.Pu_Pr_Dtl as prDtl} from '../../../../../db/cds/op/pu/pr/OP_PU_PR_DTL-model';

namespace op;
@path : '/op.PrCreateV4Service'
service PrCreateV4Service {

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

    type SavedDetail : {
        tenant_id : String;
        company_code : String;
        pr_number : String;
        pr_item_number: Integer64;
        org_type_code: String;
        org_code: String;
        buyer_empno: String;
        currency_code: String;
        estimated_price: String;
        material_code: String;
        material_group_code: String;
        pr_desc: String;
        pr_quantity: String;
        pr_unit: String;
        requestor_empno: String;
        requestor_name: String;
        purchasing_group_code: String;
        price_unit: String;
        pr_progress_status_code: String;
        remark: String;
    };  

    // (단일 Header에 multi Detail) 가 multi
    // Test 데이터
    /*********************************
    {
        "inputData": [
            {
                "header_id" : 103,
                "cd" : "CD103",
                "name": "NAME103",
                "details": [
                    {"detail_id" : 1003, "header_id" : 103, "cd" : "CD1003", "name": "NAME1003"},
                    {"detail_id" : 1004, "header_id" : 103, "cd" : "CD1004", "name": "NAME1004"}
                ]
            },
            {
                "header_id" : 104,
                "cd" : "CD104",
                "name": "NAME104",
                "details": [
                    {"detail_id" : 1005, "header_id" : 104, "cd" : "CD1003", "name": "NAME1005"},
                    {"detail_id" : 1006, "header_id" : 104, "cd" : "CD1004", "name": "NAME1006"}
                ]
            }
        ]
    }
    *********************************/
    type PrCreateSaveType {
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
        request_date: String;
        requestor_department_code: String;
        requestor_department_name: String;
        requestor_empno: String;
        requestor_name: String;
        pr_desc: String;
        details:  array of SavedDetail;
    }

    type OutType {
        return_code : String(10);
        return_msg  : String(5000);
    }

    action SavePrCreateProc (inputData : array of PrCreateSaveType) returns array of OutType;

}