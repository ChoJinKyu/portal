namespace dp;	
 
@cds.persistence.exists
entity Gs_Sourcing_Pool_Category_View {
    key tenant_id : String(5) not null @title: '테넌트ID' ;	
    key sourcing_supplier_nickname : String(100)  not null @title: '소싱공급업체별칭' ;
    key company_code : String(10)  not null @title: '회사코드' ;	
    key org_type_code : String(2)  not null @title: '조직유형코드' ;	
    key org_code : String(10)  not null @title: '조직코드' ;	
    key vendor_pool_code : String(20)  not null @title: '협력사풀코드' ;	
    vendor_pool_local_name: String(240) @title: '협력사풀로칼명';
    vendor_pool_english_name: String(240) @title: '협력사풀로칼명';
    operation_unit_code: String(30) @title: '운영단위코드';
    vendor_pool_display_name: String(240) @title: '협력사풀조회명';
    vendor_pool_level1_code: String(20) @title: '협력사풀레벨1코드';
    vendor_pool_level2_code: String(20) @title: '협력사풀레벨2코드';
    vendor_pool_level3_code: String(20) @title: '협력사풀레벨3코드';
    vendor_pool_level4_code: String(20) @title: '협력사풀레벨4코드';
    vendor_pool_level5_code: String(20) @title: '협력사풀레벨5코드';
    vendor_pool_level1_name: String(240) @title: '협력사풀레벨1명';
    vendor_pool_level2_name: String(240) @title: '협력사풀레벨2명';
    vendor_pool_level3_name: String(240) @title: '협력사풀레벨3명';
    vendor_pool_level4_name: String(240) @title: '협력사풀레벨4명';
    vendor_pool_level5_name: String(240) @title: '협력사풀레벨5명';
    child_part_desc : String(500)   @title: '하위부품설명' ;
}