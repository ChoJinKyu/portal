namespace op;	

@cds.persistence.exists
entity Pu_Pr_Template_DtlView {	
    key tenant_id           : String(5)     not null @title: '테넌트ID' ;	
    key pr_template_number  : String(10)    not null @title: '구매요청템플릿번호' ;	
    key txn_type_code       : String(30)    not null @title: '거래유형코드' ;	
    key table_name          : String(50)    not null @title: '테이블명' ;	
}	
