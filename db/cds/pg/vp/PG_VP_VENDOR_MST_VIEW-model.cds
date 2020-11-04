namespace pg;	
 
@cds.persistence.exists
entity Vp_Vendor_Mst_View {	
  tenant_id: String(5) @title: '테넌트ID';
  vendor_code: String(40) @title: '협력사코드';
  vendor_name: String(400) @title: '협력사명';
  vendor_englis_name: String(400) @title: '협력사영문명';
}