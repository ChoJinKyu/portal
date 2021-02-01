namespace pg;

@cds.persistence.exists

entity Tm_Employee_View {
    key tenant_id               : String(5)  @title : '회사코드';
    key employee_number         : String(30) @title : '담당자';
        employee_name           : String(480)@title : '담당자명';
        email_id                : String(240)@title : 'e-mail';
        job_title               : String(100)@title : '직위';
        department_code         : String(50) @title : '부서';
        department_local_name   : String(240)@title : '부서로컬명';
        department_korean_name  : String(240)@title : '부서한글명';
        department_english_name : String(240)@title : '부서영어명';
}
