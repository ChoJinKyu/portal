namespace cm;

@cds.persistence.exists
entity Get_Code_Name_Service_Func(p_tenant_id : String(5) , p_group_code : String(30), p_code : String(30), p_language_code : String(30) ) {

    key d_return : String(240);

}
