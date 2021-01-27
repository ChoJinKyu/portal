namespace ep;

using util from '../../cm/util/util-model';


entity Uc_Approval_Extra {
    key tenant_id                      : String(5) not null;
    key company_code                   : String(10) not null;
    key net_price_contract_document_no : String(50) not null;
    key net_price_contract_degree      : Integer64 not null;
    key net_price_contract_extra_seq   : Decimal not null;
        extra_number                   : String(30);
        extra_class_number             : String(30);
        extra_name                     : String(100);
        base_extra_rate                : Decimal;
        apply_extra_rate               : Decimal;
        apply_extra_desc               : String(1000);
        net_price_contract_chg_type_cd : String(30);
        use_flag                       : Boolean;
        remark                         : String(3000);
        org_type_code                  : String(2);
        org_code                       : String(10);
}

extend Uc_Approval_Extra with util.Managed;
