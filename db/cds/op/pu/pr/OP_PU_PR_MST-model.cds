namespace op;	
using util from '../../../cm/util/util-model';
using { op.Pu_Pr_Dtl as dtl } from './OP_PU_PR_DTL-model';
using { op.Pu_Pr_Template_Mst as tplm } from './OP_PU_PR_TEMPLATE_MST-model';

entity Pu_Pr_Mst {	

    key tenant_id				: String(5)      not null	 @title: '테넌트id';
    key company_code			: String(10)     not null	 @title: '회사코드';
    key pr_number				: String(50)     not null	 @title: '구매요청번호';    	

	    dtls : Composition of many dtl
			on  dtls.tenant_id = tenant_id 
			and dtls.company_code = company_code 
			and dtls.pr_number = pr_number  ;	
            
        tplm : Composition of one tplm
            on tplm.tenant_id =  tenant_id 
               and tplm.pr_template_number = pr_template_number ;


        pr_type_code            : String(30)    not null    @title: '구매요청유형코드' ;	
        pr_type_code_2          : String(30)    not null    @title: '구매요청품목그룹코드 ' ;	
        pr_type_code_3          : String(30)    not null    @title: '구매요청품목코드 ' ;	
        pr_template_number      : String(10)    not null    @title: '구매요청템플릿번호' ;	
        pr_create_system_code   : String(30)    not null    @title: '구매요청생성시스템코드' ;	
        requestor_empno         : String(30)                @title: '요청자사번' ;	
        requestor_name          : String(50)                @title: '요청자명' ;	
        requestor_department_code : String(50)              @title: '요청자부서코드' ;	
        requestor_department_name : String(240)             @title: '요청자부서명' ;	
        request_date            : Date                      @title: '요청일자' ;	
        pr_create_status_code   : String(30)                @title: '구매요청생성상태코드' ;	
        pr_desc                 : String(100)               @title: '구매요청내역' ;	
        pr_header_text          : String(200)               @title: '구매요청헤더텍스트' ;	
        approval_flag           : Boolean      @cds.on.insert: false    @title: '품의여부' ;	
        approval_number         : String(50)                @title: '품의번호' ;	
        erp_interface_flag      : Boolean      @cds.on.insert: false    @title: 'ERP인터페이스여부' ;	
        erp_pr_type_code        : String(30)                @title: 'ERP구매요청유형코드' ;	
        erp_pr_number           : String(50)                @title: 'ERP구매요청번호' ;	
    }	

extend Pu_Pr_Mst with util.Managed;