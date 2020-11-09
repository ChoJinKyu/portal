namespace pg;	
 
using util from '../../util/util-model';
using {pg as mst} from './PG_VP_VENDOR_POOL_MST-model';
	
entity Vp_Vendor_Pool_Supplier_Dtl {	
    key tenant_id : String(5) not null @title: '테넌트ID';
    key company_code : String(10) not null @title: '회사코드';
    key operation_org_type_code : String(30) not null @title: '운영조직유형코드';
    key operation_org_code : String(30) not null @title: '운영조직코드';
    key vendor_pool_code : String(30) not null @title: '협력사풀코드';
    
    ref : Association to mst.Vp_Vendor_Pool_Mst on ref.tenant_id = tenant_id and 
                                                ref.company_code = company_code and 
                                                ref.operation_org_type_code = operation_org_type_code and
                                                ref.operation_org_code = operation_org_code and
                                                ref.vendor_pool_code = vendor_pool_code;
                                                 	
    key vendor_code : String(40) not null @title: '협력사코드';
    evaluation_target_flag : Boolean @title: '평가대상여부';
    review_pass_flag : Boolean @title: '심의통과여부';
    evaluation_control_flag : Boolean @title: '평가제어여부';
    evaluation_control_start_date : Date @title: '평가제어시작일자';
    evaluation_control_end_date : Date @title: '평가제어종료일자';
    evaluation_restrict_start_date : Date @title: '평가제한시작일자';
    evaluation_restrict_end_date : Date @title: '평가제한종료일자';
    inp_code : String(30) @title: 'I&P코드';
    rm_control_flag : Boolean @title: '위험관리제어여부';
    supplier_base_portion_rate : Decimal @title: '공급업체기준분배비율';
    use_flag : Boolean @title: '사용여부';
    register_reason_text : String(300) @title: '등록사유텍스트';
    register_approval_request_number : String(50) @title: '등록승인요청번호';
}

extend Vp_Vendor_Pool_Supplier_Dtl with util.Managed;