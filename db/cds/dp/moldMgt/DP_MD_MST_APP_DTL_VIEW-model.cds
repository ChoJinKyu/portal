namespace dp;

@cds.persistence.exists
entity Md_Mst_App_Dtl_View {

    key approval_number                 : String(50)  not null  @title:'품의번호';
    key mold_id                         : String(100) not null  @title:'금형ID';
}