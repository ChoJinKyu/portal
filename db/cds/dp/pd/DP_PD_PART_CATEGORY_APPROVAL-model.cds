namespace dp;	
using util from '../../cm/util/util-model';  	
// using {dp as categoryApproval} from '../pd/Table Name-model';	
	
entity Pd_Part_Category_Approval {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key request_number : String(30)  not null @title: '요청번호' ;	
    approve_sequence : Decimal   @title: '결재순번' ;	
    approval_number : String(50)   @title: '품의번호' ;	
    requestor_empno : String(30)   @title: '요청자사번' ;	
    tf_flag : Boolean   @title: 'TF여부' ;	
    approval_comment : String(500)   @title: '결재주석' ;	
    approve_date_time : DateTime   @title: '요청일시' ;	
}	
extend Pd_Part_Category_Approval with util.Managed;