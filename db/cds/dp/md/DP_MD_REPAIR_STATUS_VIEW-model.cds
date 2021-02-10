namespace dp;

@cds.persistence.exists
entity Md_Repair_Status_View {


    key tenant_id             : String;
        repair_request_number : String;
        repair_type_code      : String;
        repair_type_name      : String;
    key mold_id               : String;


}
