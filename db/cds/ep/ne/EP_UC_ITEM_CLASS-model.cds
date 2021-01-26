namespace ep;

using util from '../../cm/util/util-model';


entity Uc_Item_Class {
    key tenant_id                 : String(5) not null;
    key company_code              : String(10) not null;
    key ep_item_class_code        : String(50) not null;
        ep_item_class_name        : String(100);
        display_sequence          : Integer64;
        parent_ep_item_class_code : String(50);
        level_number              : Decimal;
        leaf_flag                 : Boolean;
        use_flag                  : Boolean;
        remark                    : String(3000);
        org_type_code             : String(2);
        org_code                  : String(10);
}

extend Uc_Item_Class with util.Managed;
