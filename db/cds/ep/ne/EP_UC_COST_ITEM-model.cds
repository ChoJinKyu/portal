namespace ep;

using util from '../../cm/util/util-model';


entity Uc_Cost_Item {
    key tenant_id               : String(5) not null;
    key company_code            : String(10) not null;
    key org_type_code           : String(2) not null;
    key org_code                : String(10) not null;
    key cost_item_number        : String(30) not null;
    key apply_start_yyyymm      : String(6) not null;
    key apply_end_yyyymm        : String(6) not null;
        cost_item_name          : String(100);
        output_sequence         : Decimal;
        ep_expense_item_code    : String(30);
        ep_cost_apply_mode_code : String(30);
        apply_mode_desc         : String(1000);
        apply_rate              : Decimal;
        mandatory_flag          : Boolean;
        update_enable_flag      : Boolean;
        use_flag                : Boolean;
        remark                  : String(3000);
}

extend Uc_Cost_Item with util.Managed;
