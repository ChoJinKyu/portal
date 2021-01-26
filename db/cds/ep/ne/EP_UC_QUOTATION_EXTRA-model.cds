namespace ep;

using util from '../../cm/util/util-model';


entity Uc_Quotation_Extra {
    key tenant_id                      : String(5) not null;
    key company_code                   : String(10) not null;
    key const_quotation_number         : String(30) not null;
    key const_quotation_item_number    : String(50) not null;
    key apply_extra_sequence           : Decimal not null;
        net_price_contract_document_no : String(50);
        net_price_contract_degree      : Integer64;
        net_price_contract_extra_seq   : Decimal;
        extra_number                   : String(30);
        extra_class_number             : String(30);
        extra_rate                     : Decimal;
        remark                         : String(3000);
}

extend Uc_Quotation_Extra with util.Managed;
