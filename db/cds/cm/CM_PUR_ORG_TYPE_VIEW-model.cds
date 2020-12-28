namespace cm;

@cds.persistence.exists
entity Pur_Org_Type_View {

    key tenant_id         : String;
    key company_code      : String;
    key process_type_code : String;
        process_type_name : String;
        org_type_code     : String;
        org_type_name     : String;
        use_flag          : Boolean;

}