namespace ep;

using util from '../../cm/util/util-model';


entity Uc_Approval_Mst {
    key tenant_id                      : String(5) not null;
    key company_code                   : String(10) not null;
    key net_price_contract_document_no : String(50) not null;
    key net_price_contract_degree      : Integer64 not null;
        net_price_contract_title       : String(100);
        net_price_contract_status_code : String(30);
        ep_item_class_code             : String(50);
        contract_apply_date            : Date;
        net_price_contract_start_date  : Date;
        net_price_contract_end_date    : Date;
        effective_start_date           : Date;
        effective_end_date             : Date;
        contract_write_date            : Date;
        buyer_empno                    : String(30);
        purchasing_department_code     : String(50);
        quotation_reference_info       : String(100);
        attch_group_number             : String(100);
        special_note                   : LargeString;
        approval_number                : String(50);
        net_price_contract_chg_type_cd : String(30);
        delete_reason                  : String(3000);
        last_contract_flag             : Boolean;
        current_contract_flag          : Boolean;
        use_flag                       : Boolean;
        remark                         : String(3000);
        org_type_code                  : String(2);
        org_code                       : String(10)
}

extend Uc_Approval_Mst with util.Managed;
