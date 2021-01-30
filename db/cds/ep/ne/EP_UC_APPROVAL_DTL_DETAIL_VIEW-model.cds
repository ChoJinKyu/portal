namespace ep;

using util from '../../cm/util/util-model';

@cds.persistence.exists
entity Uc_Approval_Dtl_Detail_View {
    key tenant_id                      : String(5) not null;
    key company_code                   : String(10) not null;
    key net_price_contract_document_no : String(50) not null;
    key net_price_contract_degree      : Integer64 not null;
    key net_price_contract_item_number : String(50) not null;
        item_sequence                  : Decimal;
        ep_item_code                   : String(50);
        ep_item_name                   : String(100);
        spec_desc                      : String(1000);
        contract_quantity              : Decimal;
        unit                           : String(3);
        material_apply_flag            : Boolean;
        labor_apply_flag               : Boolean;
        currency_code                  : String(15);
        material_net_price             : Decimal;
        labor_net_price                : Decimal;
        remark                         : String(3000);
        org_type_code                  : String(2);
        org_code                       : String(10);
}

extend Uc_Approval_Dtl_Detail_View with util.Managed;
