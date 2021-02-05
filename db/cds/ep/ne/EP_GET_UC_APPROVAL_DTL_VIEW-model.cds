namespace ep;

using util from '../../cm/util/util-model';

@cds.persistence.exists
entity Get_Uc_Approval_Dtl_View {

    key tenant_id                      : String(5) not null;
    key company_code                   : String(10) not null;
        net_price_contract_document_no : String(50);
        net_price_contract_degree      : Integer64;
        net_price_contract_item_number  : Decimal;
        ep_item_code                   : String(50);
        item_desc                      : String(200);
        spec_desc                      : String(1000);
        unit                           : String(3);
        currency_code                  : String(15);
        currency_name                  : String(15);
        material_apply_flag            : Boolean;
        labor_apply_flag               : Boolean;
        net_price_change_allow_flag    : Boolean;
        material_net_price             : Decimal;
        labor_net_price                : Decimal;
        net_price_contract_title       : String(100);
        net_price_contract_start_date  : Date;
        net_price_contract_end_date    : Date;
        net_price_contract_period      : String(30);
        remark                         : String(3000);
        item_sequence                  : Decimal;
        //expiration_flag                : Boolean;
        
        //supplier_item_create_flag        : Boolean;

}

extend Get_Uc_Approval_Dtl_View with util.Managed;