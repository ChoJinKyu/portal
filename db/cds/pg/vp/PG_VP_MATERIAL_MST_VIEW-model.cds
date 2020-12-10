namespace pg;	
 
@cds.persistence.exists
entity Vp_Material_Mst_View {
    key bizunit_code: String(10) @title: 'VP연결조직코드';
    key language_cd: String(30) @title: '언어코드';
    key tenant_id: String(5) @title: '테넌트아이디';
    key company_code: String(10) @title: '회사코드';
    key org_type_code: String(30) @title: '조직유형코드'; 
    key org_code: String(10) @title: '조직코드';
    key material_code: String(40) @title: '품목코드';
    material_desc: String(300) @title: '품목설명';
}