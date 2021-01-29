namespace ep;

using util from '../../cm/util/util-model';

@cds.persistence.exists
entity Uc_Approval_Supplier_Detail_View {
    key tenant_id                      : String(5) not null;
    key company_code                   : String(10) not null;
    key net_price_contract_document_no : String(50) not null;
    key net_price_contract_degree      : Integer64 not null;
    key supplier_code                  : String(10) not null;
        supplier_name                  : String(240);
        distrb_rate                    : Decimal;
        apply_plant_desc               : String(1000);
        contract_number                : String(50);
        remark                         : String(3000);
}

extend Uc_Approval_Supplier_Detail_View with util.Managed;
