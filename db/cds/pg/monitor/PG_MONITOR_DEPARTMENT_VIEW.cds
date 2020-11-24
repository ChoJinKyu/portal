namespace pg;

@cds.persistence.exists

entity Monitor_Department_View {
    key tenant_id     : String(5) @title : '회사코드';
    key department_id : String(16)@title : '부서';
}
