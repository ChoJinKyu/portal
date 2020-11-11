namespace pg;
 
using util from '../../util/util-model';	
	
entity Vp_Vendor_Pool_Supplier_Tmp {	
  key tenant_id : String(5)  not null @title: '테넌트ID';	
  key company_code : String(10)  not null @title: '회사코드';	
  key org_type_code : String(30)  not null @title: '조직유형코드';	
  key org_code : String(10)  not null @title: '조직코드';	
  key vendor_pool_code : String(20)  not null @title: '협력사풀코드';	
  key vendor_code : String(15)  not null @title: '협력사코드';	
  key change_user_empno : String(30)  not null @title: '변경사용자사번';	
    before_vendor_code : String(15)   @title: '전협력사코드';	
    evaluation_target_flag : Boolean   @title: '평가대상여부';	
    review_pass_flag : Boolean   @title: '심의통과여부';	
    evaluation_control_flag : Boolean   @title: '평가제어여부';	
    evaluation_control_start_date : String(8)   @title: '평가제어시작일자';	
    evaluation_control_end_date : String(8)   @title: '평가제어종료일자';	
    evaluation_restrict_start_date : String(8)   @title: '평가제한시작일자';	
    evaluation_restrict_end_date : String(8)   @title: '평가제한종료일자';	
    inp_code : String(30)   @title: 'I&P코드';	
    rm_control_flag : Boolean   @title: '위험관리제어여부';	
    supplier_base_portion_rate : Decimal   @title: '공급업체기준분배비율';	
    approval_request_number : String(50)   @title: '승인요청번호';
}

extend Vp_Vendor_Pool_Supplier_Tmp with util.Managed;