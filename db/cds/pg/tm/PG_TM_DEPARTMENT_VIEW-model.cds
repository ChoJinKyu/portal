namespace pg;

@cds.persistence.exists

entity Tm_Department_View {
    key tenant_id       : String(5) @title : '회사코드';
        department_code : String(50)@title : '부서';
}
