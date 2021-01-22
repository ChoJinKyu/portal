namespace op;	

@cds.persistence.exists
entity Pu_Pr_Template_Txn {	
    key tenant_id           : String(5)     not null @title: '테넌트ID' ;	
    key table_name          : String(50)    not null @title: '테이블명' ;	
    key txn_type_code       : String(30)    not null @title: '거래유형코드' ;	
}	
