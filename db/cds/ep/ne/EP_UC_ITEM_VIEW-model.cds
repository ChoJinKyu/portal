namespace ep;

using util from '../../cm/util/util-model';

@cds.persistence.exists
entity Uc_Item_View {
    key tenant_id                   : String(5) not null;
    key company_code                : String(10) not null;
    key org_type_code               : String(2) not null;
    key org_code                    : String(10) not null;
    key ep_item_code                : String(50) not null;
        ep_item_name                : String(100);
        large_class_code            : String(50);
        large_class_name            : String(100);
        medium_class_code           : String(50);
        medium_class_name           : String(100);
        small_class_code            : String(50);
        small_class_name            : String(100);
        spec_desc                   : String(1000);
        unit                        : String(3);
        material_apply_yn         : String(1);
        labor_apply_yn            : String(1);
}

extend Uc_Item_View with util.Managed;
