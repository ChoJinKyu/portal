namespace ep;

@path : '/ep.UcContractMgtV4Service'
service UcContractMgtV4Service {

    type OutType : {
        returncode    : String(2);
        returnmessage : String(500);
        savedkey      : String(50);
    };

    type InputData : {
        tenant_id                      : String;
        company_code                   : String;
        net_price_contract_document_no : String;
        net_price_contract_degree      : Decimal;
        delete_reason                  : String;
    };

    action NetContractEndProc(inputData : array of InputData) returns array of OutType;

    type approvalMstType {
        tenant_id                      : String;
        company_code                   : String;
        net_price_contract_document_no : String;
        net_price_contract_degree      : Integer64;
        net_price_contract_title       : String;
        net_price_contract_status_code : String;
        net_price_contract_status_name : String;
        ep_item_class_code             : String;
        ep_item_class_name             : String;
        net_price_contract_start_date  : Date;
        net_price_contract_end_date    : Date;
        quotation_reference_info       : String;
        org_code                       : String;
        org_name                       : String;
        net_price_contract_chg_type_cd : String;
        delete_reason                  : String;
        contract_write_date            : Date;
        remark                         : String;
        buyer_empno                    : String;
        buyer_name                     : String;
        purchasing_department_code     : String;
        purchasing_department_name     : String;
        local_create_dtm               : DateTime;
        local_update_dtm               : DateTime;
        create_user_id                 : String;
        update_user_id                 : String;
        system_create_dtm              : DateTime;
        system_update_dtm              : DateTime;
        row_state                      : String;
    }

    type approvalDtlType {
        tenant_id                      : String;
        company_code                   : String;
        net_price_contract_document_no : String;
        net_price_contract_degree      : Integer64;
        net_price_contract_item_number : String;
        item_sequence                  : Decimal;
        ep_item_code                   : String;
        ep_item_name                   : String;
        spec_desc                      : String;
        contract_quantity              : Decimal;
        unit                           : String;
        material_apply_flag            : Boolean;
        labor_apply_flag               : Boolean;
        currency_code                  : String;
        material_net_price             : Decimal;
        labor_net_price                : Decimal;
        remark                         : String;
        org_type_code                  : String;
        org_code                       : String;
        local_create_dtm               : DateTime;
        local_update_dtm               : DateTime;
        create_user_id                 : String;
        update_user_id                 : String;
        system_create_dtm              : DateTime;
        system_update_dtm              : DateTime;
        row_state                      : String;
    }

    type approvalSupplierType {
        tenant_id                      : String;
        company_code                   : String;
        net_price_contract_document_no : String;
        net_price_contract_degree      : Integer64;
        supplier_code                  : String;
        supplier_name                  : String;
        distrb_rate                    : Decimal;
        apply_plant_desc               : String;
        contract_number                : String;
        remark                         : String;
        local_create_dtm               : DateTime;
        local_update_dtm               : DateTime;
        create_user_id                 : String;
        update_user_id                 : String;
        system_create_dtm              : DateTime;
        system_update_dtm              : DateTime;
        row_state                      : String;
    }

    type approvalExtraType {
        tenant_id                      : String;
        company_code                   : String;
        net_price_contract_document_no : String;
        net_price_contract_degree      : Integer64;
        net_price_contract_extra_seq   : Decimal;
        extra_number                   : String;
        extra_class_number             : String;
        extra_class_name               : String;
        extra_name                     : String;
        base_extra_rate                : Decimal;
        apply_extra_rate               : Decimal;
        apply_extra_desc               : String;
        update_enable_flag             : Boolean;
        local_create_dtm               : DateTime;
        local_update_dtm               : DateTime;
        create_user_id                 : String;
        update_user_id                 : String;
        system_create_dtm              : DateTime;
        system_update_dtm              : DateTime;
        row_state                      : String;
    }

    type saveReturnType {
        approvalMstType    : array of approvalMstType;
        approvalDtlType    : array of approvalDtlType;
        approvalSupplierType    : array of approvalSupplierType;
        approvalExtraType    : array of approvalExtraType;
    }

    action UcApprovalMstCudProc(inputData : saveReturnType) returns saveReturnType;

}
