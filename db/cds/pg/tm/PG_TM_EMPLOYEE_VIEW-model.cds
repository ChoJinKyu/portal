namespace pg;

@cds.persistence.exists

entity Tm_Employee_View {
    key tenant_id           : String(5)  @title : '회사코드';
    key employee_number     : String(30) @title : '담당자';
        employee_name       : String(480)@title : '담당자명';
        job_title           : String(100)@title : '직위';
        mobile_phone_number : String(50) @title : '휴대폰번호';
        department_id       : String(16) @title : '부서';
}
