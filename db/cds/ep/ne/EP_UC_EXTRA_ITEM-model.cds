namespace ep;

using util from '../../cm/util/util-model';


entity Uc_Extra_Item {
    key tenant_id          : String(5) not null;
    key company_code       : String(10) not null;
    key org_type_code      : String(2) not null;
    key org_code           : String(10) not null;
    key extra_class_number : String(30) not null;
    key extra_number       : String(30) not null;
        extra_name         : String(100);
        extra_desc         : String(1000);
        extra_rate         : Decimal;
        update_enable_flag : Boolean;
        use_flag           : Boolean;
}

extend Uc_Extra_Item with util.Managed;
