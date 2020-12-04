namespace cm;

@cds.persistence.exists
entity Code_View {
    key tenant_id : String(5);
    key group_code : String(30);
    key code : String(30);
    key language_code : String(30);
    code_name : String(240);
}

