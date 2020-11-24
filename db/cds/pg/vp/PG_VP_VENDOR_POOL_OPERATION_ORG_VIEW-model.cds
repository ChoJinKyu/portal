namespace pg;	
 
@cds.persistence.exists
entity Vp_Vendor_Pool_Operation_Org_View {	
  key tenant_id: String(5) @title: '테넌트ID';
  key operation_org_code: String @title: '운영조직코드';
  operation_org_name: String(240) @title: '운영조직명';
}