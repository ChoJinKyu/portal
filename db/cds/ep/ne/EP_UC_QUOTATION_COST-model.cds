namespace ep;

using util from '../../cm/util/util-model';


entity Uc_Quotation_Cost {
    key tenant_id              : String(5) not null;
    key company_code           : String(10) not null;
    key const_quotation_number : String(30) not null;
    key cost_item_number       : String(30) not null;
    key apply_start_yyyymm     : String(6) not null;
    key apply_end_yyyymm       : String(6) not null;
        apply_flag             : Boolean;
        base_apply_rate        : Decimal;
        cost_apply_rate        : Decimal;
        cost_apply_amount      : Decimal;
        remark                 : String(3000);
        org_type_code          : String(2);
        org_code               : String(10);
}

extend Uc_Quotation_Cost with util.Managed;
