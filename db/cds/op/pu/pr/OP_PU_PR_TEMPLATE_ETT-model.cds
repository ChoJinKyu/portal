namespace op;	

@cds.persistence.exists
entity Pu_Pr_Template_Ett {	
    key table_name          : String(50)    not null @title: '테이블명' ;	
    key column_name         : String(50)    not null @title: '컬럼명' ;	
}	
