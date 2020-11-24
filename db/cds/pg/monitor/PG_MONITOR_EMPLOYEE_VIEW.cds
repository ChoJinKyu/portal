namespace pg;

@cds.persistence.exists

entity Monitor_Employee_View {
    key tenant_id       : String(5)  @title : '회사코드';
    key employee_number : String(30) @title : '담당자';
        employee_name   : String(480)@title : '담당자명';
}
