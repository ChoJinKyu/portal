namespace dp;

@cds.persistence.exists
entity Md_Repair_Status_View {


    key tenant_id                      : String;
        repair_request_number          : String;
        repair_type_code               : String;
        repair_type_name               : String;
    key mold_id                        : String;
        repair_progress_status_code    : String;
        repair_progress_status_name    : String;
        repair_desc                    : String;
        repair_reason                  : String;
        approval_number                : String;
        investment_ecst_type_code      : String;
        investment_ecst_type_name      : String;
        account_code                   : String;
        account_name                   : String;
        accounting_department_code     : String;
        accounting_department_name     : String;
        remark                         : String;
        sample_quantity                : String;
        eco_number                     : String;
        repair_amount                  : String;
        repair_supplier_code           : String;
        repair_supplier_name           : String;
        repair_request_date            : String;
        mold_moving_plan_date          : String;
        mold_moving_result_date        : String;
        mold_complete_plan_date        : String;
        mold_complete_result_date      : String;
        repair_complete_date           : String;
        repair_quotation_times         : String;
        repair_mold_size               : String;
        repair_quotation_amount        : String;
        repair_supplier_quotation_date : String;
        asset_number                   : String;
        repair_request_id              : String;
        develope_step_code             : String;
        develope_step_name             : String;
        repair_factor                  : String;
        project_code                   : String;
        activity_code                  : String;
        currency_code                  : String;
        book_currency_code             : String;
        sales_status_code              : String;
        pr_number                      : String;
        acq_department_code            : String;
        acq_department_name            : String;
        budget_amount                  : String;
        budget_exrate_date             : String;
        budget_exrate                  : String;
        provisional_budget_amount      : String;
        mold_location_type_code        : String;
        mold_location_type_name        : String;
        company_code                   : String;
        company_name                   : String;
        org_type_code                  : String;
        org_code                       : String;
        org_name                       : String;
        mold_number                    : String;
        mold_sequence                  : String;
        spec_name                      : String;
        model                          : String;
        mold_item_type_code            : String;
        mold_item_type_name            : String;
        use_material_value             : String;
        mold_tonnage                   : String;
        cavity_process_qty             : String;
        request_life_shot_count        : String;
        asset_type_code                : String;
        asset_type_name                : String;
        asset_status_code              : String;
        asset_status_name              : String;
        primary_supplier_code          : String;
        primary_supplier_name          : String;
        secondary_supplier_code        : String;
        secondary_supplier_name        : String;
        approval_title                 : String;
        requestor_empno                : String;
        requestor_name                 : String;
        request_date                   : String;
        approve_status_code            : String;


}
