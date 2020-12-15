namespace dp;

@cds.persistence.exists
entity Supplier_View {

    key tenant_id             : String(5) not null;
    key company_code          : String(10) not null;
    key org_type_code         : String(2) not null;
    key org_code              : String(10) not null;
    key supplier_type_code    : String(30) not null;
    key supplier_code         : String(10) not null;
        supplier_local_name   : String(240);
        supplier_english_name : String(240);
}
