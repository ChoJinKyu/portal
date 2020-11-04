namespace pg;	
 
@cds.persistence.exists
entity Vp_Vendor_Pool_Search_View {	
  evaluation_operation_unit_code: String(30) @title: '평가운영단위코드';
  evaluation_operation_unit_name: String(12) @title: '평가운영단위';
  vendor_pool_level1_name: String @title: 'V/P(Level1)';
  vendor_pool_level2_name: String @title: 'V/P(Level2)';
  vendor_pool_level3_name: String @title: 'V/P(Level3)';
  vendor_pool_level4_name: String @title: 'V/P(Level4)';
  vendor_pool_level5_name: String @title: 'V/P(Level5)';
  inp_type_code: String(30) @title: '품목속성코드';
  inp_type_name: String(240) @title: '품목속성';
  equipment_grade_code: String(30) @title: '심의등급';
  equipment_type_code: String(30) @title: '장비구분';
  vendor_code: String(15) @title: '협력사 코드';
  vendor_local_name: String(240) @title: '협력사 명'; 
  vendor_english_name: String(240) @title: '협력사 영문명';
  company_name: String(240) @title: '법인명';
  vendor_type_name: String(240) @title: '분류';
  supplier_flag: Boolean @title: '공급유형(Supplier)';
  maker_flag: Boolean @title: '공급유형(Maker)';
  vendor_status_name: String(240) @title: '거래상태';
  evaluation_control_flag: Boolean @title: '평가통제';
  evaluation_control_start_date: String(8) @title: '평가통제시작';
  evaluation_control_end_date: String(8) @title: '평가통제종료';
  rm_control_flag: Boolean @title: 'RM통제';
  sd_exception_flag: Boolean @title: 'SD예외';
  vendor_pool_exception_flag: Boolean @title: 'V/P예외';
  repr_department_code: String(50) @title: '구매부서코드';
  repr_department_name: String(240) @title: '구매부서';
  managers_name: String @title: '담당자';
}