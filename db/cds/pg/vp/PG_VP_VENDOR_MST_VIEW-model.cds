namespace pg;	
 
@cds.persistence.exists
entity Vp_Vendor_Mst_View {	
  key tenant_id: String(5) @title: '테넌트ID';
  key supplier_code: String(40) @title: '공급업체코드';
  supplier_local_name: String(400) @title: '공급업체명';
  supplier_english_name: String(400) @title: '공급업체영문명';
}