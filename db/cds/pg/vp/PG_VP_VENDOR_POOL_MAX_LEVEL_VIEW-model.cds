namespace pg;	
 
@cds.persistence.exists
entity Vp_Vendor_Pool_Max_Level_View (p_tenant_id: String, p_language_code: String){
    key language_cd : String(2) @title: '언어코드';
    key tenant_id : String(5)  not null @title: '테넌트ID';
    key org_code : String(10)  not null @title: '운영조직코드';
    key operation_unit_code : String(30) @title: '운영단위코드';
    max_level : String(5) @title: 'Max Level Path';    
}