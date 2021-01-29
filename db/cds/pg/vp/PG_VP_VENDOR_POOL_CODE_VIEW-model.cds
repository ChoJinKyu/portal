namespace pg;	
 
@cds.persistence.exists
entity Vp_Vendor_Pool_Code_View (p_tenant_id: String, p_company_code: String, p_org_type_code: String){    
    key tenant_id               : String(5)    not null @title : '테넌트ID';
    key company_code            : String(10)   not null @title : '회사코드';
    key org_type_code           : String(2)    not null @title : '운영조직유형코드';
    key org_code                : String(10)   not null @title : '운영조직코드';
    key operation_unit_code     : String(30)   not null @title : '운영조직코드';
    key code                    : String(20)   not null @title: '협력사풀코드';
    code_name                   : String(240)           @title: '협력사풀로칼명';
    parent_code                 : String(20)            @title: '상위협력사풀코드';
    leaf_flag                   : Boolean               @title: '리프여부';
    vendor_pool_level           : String(5)             @title: '레벨번호';           
}