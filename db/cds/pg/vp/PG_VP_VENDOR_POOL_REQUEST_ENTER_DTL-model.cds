namespace pg;
 
using util from '../../util/util-model';
	
entity Vp_Vendor_Pool_Request_Enter_Dtl {	
  key tenant_id : String(5)  not null @title: '테넌트ID';	
  key company_code : String(10)  not null @title: '회사코드';	
  key operation_org_type_code : String(2)  not null @title: '운영조직유형코드';	
  key operation_org_code : String(10)  not null @title: '운영조직코드';	
  key approval_request_number : String(50)  not null @title: '승인요청번호';	
  key vendor_code : String(15)  not null @title: '협력사코드';	
    vendor_name : String(240)   @title: '협력사명';	
    proposal_kind_name : String(240)   @title: '제안종류명';	
    proposal_name : String(240)   @title: '제안명';	
    proposal_date : String(8)   @title: '제안일자';	
    proposal_confirmed_date : String(8)   @title: '제안확정일자';	
    vendor_pool_code : String(20)   @title: '협력사풀코드';	
    technology_evaluation_main_dtl : String(3000)   @title: '기술평가주요내역';	
    txn_hope_id : String(100)   @title: '거래희망ID';	
}

extend Vp_Vendor_Pool_Request_Enter_Dtl with util.Managed;
