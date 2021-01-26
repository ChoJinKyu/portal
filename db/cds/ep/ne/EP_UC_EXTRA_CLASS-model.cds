namespace ep;

using util from '../../cm/util/util-model';


entity Uc_Extra_Class {
    key tenant_id             : String(5) not null;
    key company_code          : String(10) not null;
    key org_type_code         : String(2) not null;
    key org_code              : String(10) not null;
    key extra_class_number    : String(30) not null;
        extra_class_name      : String(100);
        item_apply_type_code  : String(30);
        labor_apply_type_code : String(30);
        use_flag              : Boolean;
        remark                : String(3000);
}

extend Uc_Extra_Class with util.Managed;
