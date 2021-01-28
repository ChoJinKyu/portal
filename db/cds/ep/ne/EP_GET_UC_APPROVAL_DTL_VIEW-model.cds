namespace ep;

using util from '../../cm/util/util-model';

@cds.persistence.exists
entity Get_Uc_Approval_Dtl_View {

    key tenant_id                      : String(5) not null;
    key company_code                   : String(10) not null;
    key net_price_contract_document_no : String(50) not null;
    key net_price_contract_degree      : Integer64 not null;
        ep_item_class_code             : String(50);
        ep_item_code                   : String(50);
        item_desc                      : String(200);
        spec_desc                      : String(1000);
        unit                           : String(3);
        material_net_price             : Decimal;
        labor_net_price                : Decimal;
        net_price_contract_title       : Date;
        net_price_contract_start_date  : Date;
        net_price_contract_end_date    : Date;


}

extend Get_Uc_Approval_Dtl_View with util.Managed;