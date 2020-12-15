namespace dp;	
 
@cds.persistence.exists
entity Pd_Operation_Org_View {	
  key tenant_id: String(5) @title: '테넌트ID';
  key org_type_code: String @title: '조직유형코드';
  key org_type_name: String @title: '조직유형코드';
  key operation_org_code: String @title: '조직코드';
  operation_org_name: String(240) @title: '조직명';
}