namespace pg;	
 
@cds.persistence.exists
entity Vp_Vendor_pool_Popup_View {	
  key tenant_id : String(5)  not null @title: '테넌트ID';
  key company_code : String(10)  not null @title: '회사코드';
  key org_type_code : String(2)  not null @title: '운영조직유형코드';
  key org_code : String(10)  not null @title: '운영조직코드';
  key operation_unit_code: String(30) @title: '운영단위코드';
  key vendor_pool_code: String(20) @title: '협력사풀코드';
  vendor_pool_local_name: String(240) @title: '협력사풀로컬명';
  vendor_pool_english_name: String(240) @title: '협력사풀영문명';
  parent_vendor_pool_code: String(20) @title: '상위협력사풀코드';
  higher_level_path: String @title: '상위레벨경로';
  level_path: String @title: '현재레벨경로';
  temp_type: String(1) @title: '공급업체변경여부(Y/N)';
  node_id: String @title: 'node id';
  parent_id: String @title: 'parent node id';
  path: String @title: 'node path';
  hierarchy_rank: Integer64;
  hierarchy_tree_size: Integer64;
  hierarchy_parent_rank: Integer64;
  hierarchy_level: Integer;
  hierarchy_root_rank: Integer64;
  drill_state: String @title: 'expanded/leaf';
  child_drill_state: String @title: 'expanded/leaf/X';
  vendor_pool_path_code: String(240) @title: 'VP Code Chain';
  vendor_pool_path_name: String(400) @title: 'VP Code Name Chain';
}