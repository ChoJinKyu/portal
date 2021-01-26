namespace ep;

using util from '../../cm/util/util-model';


entity Uc_Item {
    key tenant_id                   : String(5) not null;
    key company_code                : String(10) not null;
    key org_type_code               : String(2) not null;
    key org_code                    : String(10) not null;
    key ep_item_code                : String(50) not null;
        ep_item_class_code          : String(50);
        ep_item_name                : String(100);
        spec_desc                   : String(1000);
        unit                        : String(3);
        attch_group_number          : String(100);
        material_apply_flag         : Boolean;
        labor_apply_flag            : Boolean;
        net_price_change_allow_flag : Boolean;
        use_flag                    : Boolean;
        remark                      : String(3000);
}

extend Uc_Item with util.Managed;
