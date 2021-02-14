namespace pg;	
 
@cds.persistence.exists
entity Vp_Vendor_Pool_Supplier_Type {	
    key tenant_id: String(5)  not null @title: '테넌트ID';
    key company_code: String(10)  not null @title: '회사코드';
    key org_type_code: String(2)  not null @title: '운영조직유형코드';
    key org_code: String(10)  not null @title: '운영조직코드';
    key vendor_pool_code: String(20)  not null @title: '협력사풀코드';
    key supplier_code: String(15)  not null @title: '공급업체코드';
    supeval_target_flag: Boolean  @title: '공급업체평가대상여부';
    supplier_op_plan_review_flag: Boolean   @title: '공급업체운영계획심의여부';
    supeval_control_flag: Boolean   @title: '공급업체평가통제여부';
    supeval_control_start_date: String(10)   @title: '공급업체평가통제시작일자';
    supeval_control_end_date: String(10)   @title: '공급업체평가통제종료일자';
    supeval_restrict_start_date: String(10)   @title: '공급업체평가제한시작일자';
    supeval_restrict_end_date: String(10)   @title: '공급업체평가제한종료일자';
    inp_code: String(30)   @title: '상벌코드';
    supplier_rm_control_flag: Boolean   @title: '공급업체위험관리제어여부';
    supplier_base_portion_rate: Decimal   @title: '공급업체기준분배비율';
    vendor_pool_mapping_use_flag: String(2)   @title: '협력사풀매핑사용여부';
    register_reason: String(50)   @title: '등록사유';
    approval_number: String(50)   @title: '품의번호';
    crud_type_code : String(2)    @title: 'CRUD유형';
}