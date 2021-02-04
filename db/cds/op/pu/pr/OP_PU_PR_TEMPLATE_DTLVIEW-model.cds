namespace op;	

@cds.persistence.exists
entity Pu_Pr_Template_DtlView {	
    key tenant_id           : String(5)     not null @title: '테넌트ID' ;	
    key pr_template_number  : String(10)    not null @title: '구매요청템플릿번호' ;	
        txn_type_code       : String(30)    not null @title: '거래유형코드' ;	
        table_name          : String(50)    not null @title: '테이블명' ;	
        column_name         : String(50)    not null @title: '컬럼명' ;	
        erp_interface_flag  : Boolean       not null  @title: 'ERP인터페이스여부' ;	
        default_template_number : String(10)          @title: '기본템플릿번호' ;	
        approval_flag       : Boolean       not null  @title: '품의여부' ;	
        use_flag            : Boolean       not null  @title: '사용여부' ;	
        ettLabel            : String(50)    not null  @title: 'ETT Label' ;	
        ettStatus           : String(30)    not null  @title: 'ETT 상태' ;	
        
}	
