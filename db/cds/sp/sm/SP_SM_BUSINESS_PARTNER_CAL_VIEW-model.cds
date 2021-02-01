namespace sp;

@cds.persistence.exists

entity Sm_Business_Partner_Cal_View {
    key tenant_id                             : String(5);
    key company_code                          : String(10);
    key org_code                              : String(10);
        org_name                              : String(240);
        type_code                             : String(30);
        type_name                             : String(240);
    key business_partner_code                 : String(10);
        business_partner_local_name           : String(240);
        business_partner_english_name         : String(240);
        supplier_role                         : String(1);
        maker_role                            : String(1);
        tax_id                                : String(30);
        old_supplier_code                     : String(15);
        old_maker_code                        : String(15);
        business_partner_register_status_code : String(30);
        business_partner_register_status_name : String(240);
        business_partner_status_code          : String(1);
        business_partner_status_name          : String(240);
}
