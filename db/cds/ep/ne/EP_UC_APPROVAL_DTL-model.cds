namespace ep;

using util from '../../cm/util/util-model';


entity Uc_Approval_Dtl {
    key tenant_id                      : String(5) not null;
    key company_code                   : String(10) not null;
    key net_price_contract_document_no : String(50) not null;
    key net_price_contract_degree      : Integer64 not null;
    key net_price_contract_item_number : String(50) not null;
        item_sequence                  : Decimal;
        ep_item_code                   : String(50);
        item_desc                      : String(200);
        spec_desc                      : String(1000);
        contract_quantity              : Decimal;
        unit                           : String(3);
        material_apply_flag            : Boolean;
        labor_apply_flag               : Boolean;
        material_net_price             : Decimal;
        labor_net_price                : Decimal;
        net_price_amount               : Decimal;
        currency_code                  : String(15);
        net_price_contract_chg_type_cd : String(30);
        delete_reason                  : String(3000);
        use_flag                       : Boolean;
        remark                         : String(3000);
        org_type_code                  : String(2);
        org_code                       : String(10);
}

extend Uc_Approval_Dtl with util.Managed;
