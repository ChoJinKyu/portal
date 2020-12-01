namespace pg;	
 
using util from '../../cm/util/util-model';	
	
entity Vp_Vendor_Pool_Mst {	
  key tenant_id : String(5)  not null @title: '테넌트ID';
  key company_code : String(10)  not null @title: '회사코드';
  key org_type_code : String(2)  not null @title: '운영조직유형코드';
  key org_code : String(10)  not null @title: '운영조직코드';
  key vendor_pool_code : String(20)  not null @title: '협력사풀코드';
    vendor_pool_local_name : String(240)   @title: '협력사풀로칼명';
    vendor_pool_english_name : String(240)   @title: '협력사풀로칼명';
    repr_department_code : String(50)   @title: '대표부서코드';
    operation_unit_code : String(30)   @title: '운영단위코드';
    inp_type_code : String(30)   @title: '상벌유형코드';
    mtlmob_base_code : String(30)   @title: '물동기준코드';
    regular_evaluation_flag : Boolean   @title: '정기평가여부';
    industry_class_code : String(30)   @title: '산업분류코드';
    sd_exception_flag : Boolean   @title: '공급업체발굴예외여부';
    vendor_pool_apply_exception_flag : Boolean   @title: '협력사풀적용예외여부';
    domestic_net_price_diff_rate : Decimal   @title: '국내단가차이비율';
    dom_oversea_netprice_diff_rate : Decimal   @title: '국내국외단가차이비율';
    equipment_grade_code : String(30)   @title: '장비등급코드';
    equipment_type_code : String(30)   @title: '장비유형코드';
    vendor_pool_use_flag : Boolean   @title: '협력사풀사용여부';
    vendor_pool_desc : String(3000)   @title: '협력사풀설명';
    vendor_pool_history_desc : String(3000)   @title: '협력사풀이력설명';
    parent_vendor_pool_code : String(20)   @title: '상위협력사풀코드';
    leaf_flag : Boolean   @title: '리프여부';
    level_number : Decimal   @title: '레벨번호';
    display_sequence : Integer64   @title: '조회순번';
    register_reason : String(50)   @title: '등록사유';
    approval_number : String(50)   @title: '품의번호';
}

extend Vp_Vendor_Pool_Mst with util.Managed;