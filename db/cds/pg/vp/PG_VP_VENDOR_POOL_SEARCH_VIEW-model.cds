namespace pg;	
 
@cds.persistence.exists
entity Vp_Vendor_Pool_Search_View {	
  key tenant_id: String(5) @title: '테넌트ID';
  key company_code: String(10) @title: '회사코드';
  key org_type_code: String(2) @title: '조직유형코드';
  key org_code: String(10) @title: '조작코드';
  language_cd: String(2) @title: '다국어적용코드';
  key operation_unit_code: String(30) @title: '평가운영단위코드';
  operation_unit_name: String @title: '평가운영단위';
  key vendor_pool_code: String(30) @title: '협력사풀코드';
  vendor_pool_local_name: String(240) @title: '협력사풀로컬명';
  vendor_pool_english_name: String(240) @title: '협력사풀영문명';
  vendor_pool_level1_name: String @title: 'V/P(Level1)';
  vendor_pool_level2_name: String @title: 'V/P(Level2)';
  vendor_pool_level3_name: String @title: 'V/P(Level3)';
  vendor_pool_level4_name: String @title: 'V/P(Level4)';
  vendor_pool_level5_name: String @title: 'V/P(Level5)';
  higher_level_path: String @title: '상위레벨경로(같은레벨)';
  level_path: String @title: '상위레벨경로(하위레벨)';
  info_change_status: String @title: '정보변경상태';
  inp_type_code: String(30) @title: '품목속성코드';
  inp_type_name: String @title: '품목속성';
  equipment_grade_code: String(30) @title: '심의등급코드';
  equipment_grade_name: String @title: '심의등급';
  equipment_type_code: String(30) @title: '장비구분코드';
  equipment_type_name: String @title: '장비구분';
  supplier_quantity: Integer64 @title: '공급업체수';
  supplier_code: String(15) @title: '공급업체 코드';
  supplier_local_name: String @title: '공급업체 명'; 
  supplier_english_name: String @title: '공급업체 영문명';
  supplier_company_code: String(30) @title: '공급업체법인코드';
  supplier_company_name: String @title: '공급업체법인명';
  supplier_type_name: String @title: '분류';
  supplier_flag: Boolean @title: '공급유형(Supplier)';
  maker_flag: Boolean @title: '공급유형(Maker)';
  supplier_status_name: String(240) @title: '거래상태';
  supeval_control_flag: Boolean @title: '평가통제';
  supeval_control_start_date: String(10) @title: '평가통제시작';
  supeval_control_end_date: String(10) @title: '평가통제종료';
  temp_type: String(1) @title: '공급업체변경여부(Y/N)';
  supplier_rm_control_flag: Boolean @title: 'RM통제';
  sd_exception_flag: Boolean @title: 'SD예외';
  vendor_pool_apply_exception_flag: Boolean @title: 'V/P예외';
  maker_material_code_mngt_flag    : Boolean             @title : '제조사자재코드관리여부';
  repr_department_code: String(50) @title: '구매부서코드';
  repr_department_name: String @title: '구매부서';
  managers_name: String @title: '담당자';
  hierarchy_rank: Integer64;
}