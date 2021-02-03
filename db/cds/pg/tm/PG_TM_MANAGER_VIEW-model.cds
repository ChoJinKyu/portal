namespace pg;

@cds.persistence.exists

entity Tm_Manager_View {
    key tenant_id                       : String(5)  @title : '회사코드';
    key scenario_number                 : Integer64  @title : '시나리오번호';
    key employee_number                 : String(30) @title : '담당자';
        employee_name                   : String(480)@title : '담당자명';
        job_title                       : String(100)@title : '직위';
        email_id                        : String(240)@title : 'e-mail';
        mobile_phone_number             : String(50) @title : '휴대폰번호';
        department_code                 : String(50) @title : '부서';
        department_local_name           : String(240)@title : '부서로컬명';
        department_korean_name          : String(240)@title : '부서한글명';
        department_english_name         : String(240)@title : '부서영어명';
        monitoring_super_authority_flag : Boolean    @title : '모니터링최상위권한여부';
}
