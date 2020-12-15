namespace pg;

@cds.persistence.exists

entity Tm_Job_Title_View {
    key tenant_id : String(5)  @title : '회사코드';
        job_title : String(100)@title : '직무';
}
