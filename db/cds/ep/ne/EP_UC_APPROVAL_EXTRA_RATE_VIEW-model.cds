namespace ep;

using util from '../../cm/util/util-model';

@cds.persistence.exists
entity Uc_Approval_Extra_Rate_View {
    key tenant_id                      : String(5) not null;
    key company_code                   : String(10) not null;
    key net_price_contract_document_no : String(50) not null;
    key net_price_contract_degree      : Integer64 not null;
    key net_price_contract_extra_seq   : Decimal not null;
        extra_number                   : String(30);
        extra_class_number             : String(30);
        extra_class_name               : String(100);
        extra_name                     : String(100);
        apply_extra_rate               : Decimal;
        apply_extra_desc               : String(1000);

}

extend Uc_Approval_Extra_Rate_View with util.Managed;
