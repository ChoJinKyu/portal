namespace op;	

using util from '../../../cm/util/util-model';

entity Pu_Pr_Template_Map {	 
    key tenant_id       : String(5)     not null @title: '테넌트ID' ;	
    key pr_type_code    : String(30)    not null @title: '구매요청유형코드' ;	
    key pr_type_code_2  : String(30)    not null @title: '구매요청품목그룹코드' ;	
    key pr_type_code_3  : String(30)    not null @title: '구매요청품목코드' ;	
    key pr_template_number : String(10) not null @cds.on.insert: 'TCTZZZZ'  @title: '구매요청템플릿번호' ;	
        use_flag        : Boolean       not null @cds.on.insert: false  @title: '사용여부' ;	
    }	
extend Pu_Pr_Template_Map with util.Managed;    

