namespace ep;

@path : '/ep.UcQuotationMgtV4Service'
service UcQuotationMgtV4Service {

    type OutType : {
        returncode    : String(2);
        returnmessage : String(500);
        savedkey      : String(50);
    };

    type UcMasterData : {
        tenant_id                  : String;   
        company_code               : String;   
        const_quotation_number     : String;   
        org_code                   : String;   
        org_name                   : String;   
        const_name                 : String;   
        ep_item_code               : String;   
        const_start_date           : Date;      
        const_end_date             : Date;     
        quotation_status_code      : String;   
        quotation_status_name      : String;   
        supplier_code              : String;   
        buyer_empno                : String;   
        buyer_name                 : String;   
        const_person_empno         : String;   
        const_person_name          : String;   
        purchasing_department_code : String;   
        purchasing_department_name : String;   
        pr_number                  : String;   
        quotation_write_date       : Date;      
        remark                     : String;   
        currency_code              : String;   
        attch_group_number         : String;   
        supplier_write_flag        : Boolean;   
        completion_flag            : Boolean;   
        completion_date            : Date;      
        facility_person_empno      : String;   
        facility_person_name       : String;   
        facility_department_code   : String;   
        completion_attch_group_number : String;
        local_create_dtm           : DateTime;
        local_update_dtm           : DateTime;
        create_user_id             : String;
        update_user_id             : String;
        system_create_dtm          : DateTime;
        system_update_dtm          : DateTime;
        row_state                  : String; 
    };

    type UcDetailData : {
        tenant_id                       : String;
        company_code                    : String;
        const_quotation_number          : String;
        const_quotation_item_number     : String;
        item_sequence                   : Decimal;
        ep_item_code                    : String;
        item_desc                       : String;
        spec_desc                       : String;
        quotation_quantity              : Decimal;
        extra_rate                      : String;
        unit                            : String;
        currency_code                   : String;
        currency_name                   : String;
        material_apply_flag             : Boolean;
        labor_apply_flag                : Boolean;
        net_price_change_allow_flag     : Boolean;
        base_material_net_price         : Decimal;
        base_labor_net_price            : Decimal;
        material_net_price              : Decimal;
        material_amount                 : Decimal;
        labor_net_price                 : Decimal;
        labor_amount                    : Decimal;
        sum_amount                      : Decimal;
        remark                          : String;
        net_price_contract_document_no  : String;
        net_price_contract_degree       : Integer64;              
        net_price_contract_item_number  : String;        
        supplier_item_create_flag       : Boolean; 
        local_create_dtm                : DateTime;
        local_update_dtm                : DateTime;
        create_user_id                  : String;
        update_user_id                  : String;
        system_create_dtm               : DateTime;
        system_update_dtm               : DateTime;
        row_state                       : String; 
    };

    type UcQuotationExtraData : {
        tenant_id                       : String;
        company_code                    : String;
        const_quotation_number          : String;
        const_quotation_item_number     : String;
        apply_extra_sequence            : Decimal;
        net_price_contract_document_no  : String;
        net_price_contract_degree       : Integer64;   
        net_price_contract_extra_seq    : Decimal;
        extra_number                    : String;
        extra_class_number              : String;
        extra_rate                      : String;
        remark                          : String;
        local_create_dtm                : DateTime;
        local_update_dtm                : DateTime;
        create_user_id                  : String;
        update_user_id                  : String;
        system_create_dtm               : DateTime;
        system_update_dtm               : DateTime;
        row_state                       : String; 
    };


    type saveReturnType {
        ucMasterData    : array of UcMasterData;
        ucDetailData    : array of UcDetailData;
        ucQuotationExtraData    : array of UcQuotationExtraData;
    //savedSuppliers : array of SavedSuppliers;
    };

    action SaveUcQuotationDtlProc(inputData : saveReturnType) returns saveReturnType;
 
    //action SaveUcQuotationExtraProc(inputData : array of UcQuotationExtraData) returns UcQuotationExtraData;

}
