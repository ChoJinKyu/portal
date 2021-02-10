namespace ep;

using util from '../../cm/util/util-model';

@cds.persistence.exists
entity Uc_Approval_Mst_Detail_View {

    key tenant_id                      : String(5) not null;
    key company_code                   : String(10) not null;
    key net_price_contract_document_no : String(50) not null;
    key net_price_contract_degree      : Integer64 not null;
        net_price_contract_title       : String(100);
        net_price_contract_status_code : String(30);
        net_price_contract_status_name : String(240);
        ep_item_class_code             : String(50);
        ep_item_class_name             : String(100);
        net_price_contract_start_date  : Date;
        net_price_contract_end_date    : Date;
        quotation_reference_info       : String(100);
        org_code                       : String(10);
        org_name                       : String(240);
        net_price_contract_chg_type_cd : String(30);
        delete_reason                  : String(3000);
        contract_write_date            : Date;
        remark                         : String(3000);
        buyer_empno                    : String(30);
        buyer_name                     : String(240);
        purchasing_department_code     : String(50);
        purchasing_department_name     : String(240);
        special_note                   : LargeString;

}

extend Uc_Approval_Mst_Detail_View with util.Managed;
