namespace ep;

using util from '../../cm/util/util-model';


entity Uc_Quotation_Dtl {
    key tenant_id                      : String(5) not null;
    key company_code                   : String(10) not null;
    key const_quotation_number         : String(30) not null;
    key const_quotation_item_number    : String(50) not null;
        item_sequence                  : Decimal;
        ep_item_code                   : String(50);
        item_desc                      : String(200);
        spec_desc                      : String(1000);
        quotation_quantity             : Decimal;
        unit                           : String(3);
        material_apply_flag            : Boolean;
        labor_apply_flag               : Boolean;
        //net_price_change_allow_flag    : Boolean;
        //base_material_net_price        : Decimal;
        //base_labor_net_price           : Decimal;
        material_net_price             : Decimal;
        material_amount                : Decimal;
        labor_net_price                : Decimal;
        labor_amount                   : Decimal;
        sum_amount                     : Decimal;
        //currency_code                  : String(15);
        extra_rate                     : Decimal;
        net_price_contract_document_no : String(50);
        net_price_contract_degree      : Integer64;
        net_price_contract_item_number : String(50);
        supplier_item_create_flag      : Boolean;
        remark                         : String(3000);
}

extend Uc_Quotation_Dtl with util.Managed;

