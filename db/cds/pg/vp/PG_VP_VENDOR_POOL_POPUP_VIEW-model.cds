namespace pg;	
 
@cds.persistence.exists
entity Vp_Vendor_pool_Popup_View {	
  key tenant_id: String(5) @title: '테넌트ID';
  key org_code: String(10) @title: '조직코드';
  key operation_unit_code: String(30) @title: '운영단위코드';
  key vendor_pool_code: String(20) @title: '협력사풀코드';
  vendor_pool_local_name: String(240) @title: '협력사풀로컬명';
  vendor_pool_english_name: String(240) @title: '협력사풀영문명';
  parent_vendor_pool_code: String(20) @title: '상위협력사풀코드';
  higher_level_path: String @title: '상위레벨경로';
  level_path: String @title: '현재레벨경로';
  node_id: String @title: 'node id';
  parent_id: String @title: 'parent node id';
  hierarchy_rank: Integer64;
  hierarchy_tree_size: Integer64;
  hierarchy_parent_rank: Integer64;
  hierarchy_level: Integer;
  hierarchy_root_rank: Integer64;
  drill_state: String @title: 'expanded/leaf';
}