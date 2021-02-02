namespace ep;

@path : '/ep.UcQuotationMgtV4Service'
service UcQuotationMgtV4Service {

    type OutType : {
        returncode    : String(2);
        returnmessage : String(500);
        savedkey      : String(50);
    };

    type InputData : {
        tenant_id                       : String;
        company_code                    : String;
        const_quotation_number          : String;
        const_quotation_item_number     : String;
        item_sequence                   : Decimal;
        ep_item_code                    : String;
        item_desc                       : String;
        spec_desc                       : String;
        quotation_quantity              : Decimal;
        extra_rate                      : Decimal;
        unit                            : String;
        currency_code                   : String;
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
        net_price_contract_degree       : Decimal;              
        net_price_contract_item_number  : String;        
        supplier_item_create_flag       : Boolean;  
    };

    action SaveUcQuotationDtlProc(inputData : array of InputData) returns array of OutType;

}
