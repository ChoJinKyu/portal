namespace dp;	

@cds.persistence.exists
entity Pd_Product_Activity_Template_Type {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key product_activity_code : String(40)  not null @title: '제품활동코드' ;	
    sequence : Decimal default 1  @title: '순번' ;	
    product_activity_name : String(240)   @title: '제품활동명' ;	
    active_flag : Boolean   @title: '활성여부' ;
    update_user_id : String(255) @title: '최종수정자';
    system_update_dtm : DateTime @title: '최종수정일시';    
    crud_type_code : String(1)     @title: 'CRUD유형';
    update_product_activity_code : String(40)  not null @title: '변경후 제품활동코드' ;	
}