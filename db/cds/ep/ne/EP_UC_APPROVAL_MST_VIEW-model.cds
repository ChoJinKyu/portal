namespace ep;

using util from '../../cm/util/util-model';

@cds.persistence.exists
entity Uc_Approval_Mst_View {

    key tenant_id                      : String(5) not null;
    key company_code                   : String(10) not null;
    key net_price_contract_document_no : String(50) not null;
    key net_price_contract_degree      : Integer64 not null;
        org_type_code                  : String(2);
        org_code                       : String(10);
        net_price_contract_title       : String(100);
        ep_item_class_code             : String(50);
        ep_item_class_name             : String(100);
        supplier_code                  : String(100);
        supplier_name                  : String(500);
        net_price_contract_start_date  : Date;
        net_price_contract_end_date    : Date;
        net_price_contract_status_code : String(30);
        net_price_contract_status_name : String(240);
        effective_status_code          : String(3);
        effective_status_name          : String(10);
        net_price_contract_day_count   : Decimal;
        net_price_contract_chg_type_cd : String(30);
        delete_reason                  : String(3000);
}

extend Uc_Approval_Mst_View with util.Managed;
