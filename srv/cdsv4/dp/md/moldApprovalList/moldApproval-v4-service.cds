using {cm as approvalMst} from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';
using {dp as approvalDtl} from '../../../../../db/cds/dp/md/DP_MD_APPROVAL_DTL-model';
using {cm as approver} from '../../../../../db/cds/cm/CM_APPROVER-model';
using {dp as moldMst} from '../../../../../db/cds/dp/md/DP_MD_MST-model';
using {cm as referer} from '../../../../../db/cds/cm/CM_REFERER-model';

namespace dp;
@path : '/dp.MoldApprovalV4Service'
service MoldApprovalV4Service { 

   type ApprovalMaster : {
        tenant_id               : String;
        approval_number         : String;
        legacy_approval_number  : String;
        company_code            : String;
        org_type_code           : String;
        org_code                : String;
        chain_code              : String;
        approval_type_code      : String;
        approval_title          : String;
        approval_contents       : String;
        approve_status_code     : String;
        requestor_empno         : String;
        request_date            : String;
        attch_group_number      : String;
        local_create_dtm        : DateTime;
        local_update_dtm        : DateTime;
   };

    type ApprovalDetails : {
        tenant_id           : String;
        approval_number     : String;
        mold_id             : String;
    };

    type Approver : {
        tenant_id           : String;
        approval_number     : String;
        approve_sequence    : String;
        approver_type_code  : String;
        approver_empno      : String;
        approve_status_code : String;
        approve_comment     : String;
    };

    type Referer : {
        tenant_id       : String;
        approval_number : String;
        referer_empno   : String;
    };

    type MoldMaster : {
        tenant_id: String ;
        company_code: String ;
        org_type_code: String ;
        org_code: String ;
        mold_number: String ;
        mold_sequence: String ;
        mold_id: String ;
        mold_progress_status_code: String ;
        asset_number: String ;
        mold_item_type_code: String ;
        mold_production_type_code: String ;
        mold_location_type_code: String ;
        first_production_date: String ;
        production_complete_date: String ;
        budget_amount: String ;
        currency_code: String ;
        target_amount: String ;
        mold_purchasing_type_code: String ;
        supplier_selection_remark: String ;
        order_confirmed_amount: String ;
        supplier_code: String ;
        purchasing_amount: String ;
        order_number: String ;
        investment_ecst_type_code: String ;
        project_code: String ;
        receiving_amount: String ;
        receiving_complete_date: String ;
        account_code: String ;
        accounting_department_code: String ;
        acq_department_code: String ;
        production_supplier_code: String ;
        remark: String ;
        mold_develope_request_type_code: String ;
        mold_develope_requestor_empno: String ;
        eco_number: String ;
        set_id: String ;
        ap_transfer_status_code: String ;
        market_type_code: String ;
        product_group_code: String ;
        product_group_type_code: String ;
        purchasing_contract_number: String ;
        lease_contract_number: String ;
        provisional_budget_amount: String ;
        book_currency_code: String ;
        budget_exrate_date: String ;
        budget_exrate: String ;
        split_pay_flag: String ;
        prepay_rate: String ;
        progresspay_rate: String ;
        rpay_rate: String ;
        mold_sales_status_code: String ;
        pr_number: String ;
        import_company_code: String ;
        import_company_org_code: String ;
        inspection_date: String ;
        mold_cost_analysis_type_code: String ;
        mold_type_code: String ;
        mold_mfger_code: String ;
        mold_developer_empno: String ;
        customer_asset_type_code: String ;
        asset_type_code: String ;
        asset_status_code: String ;
        scrap_date: String ;
        acq_date: String ;
        acq_amount: String ;
        use_department_code : String ;
    };

    type saveReturnType {
        approvalMaster :  ApprovalMaster ;
        approvalDetails : array of ApprovalDetails;
        approver : array of Approver;
        moldMaster : array of MoldMaster;
        referer : array of Referer;
    }

    action saveMoldApproval ( inputData : saveReturnType ) returns saveReturnType;

}