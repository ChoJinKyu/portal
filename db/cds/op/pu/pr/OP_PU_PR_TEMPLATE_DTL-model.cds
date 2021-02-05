namespace op;	

using util from '../../../cm/util/util-model';
using { op.Pu_Pr_Template_Mst as tplm } from './OP_PU_PR_TEMPLATE_MST-model';

entity Pu_Pr_Template_Dtl {	 
    key tenant_id           : String(5)     not null @title: '테넌트ID' ;	
    key pr_template_number  : String(10)    not null @title: '구매요청템플릿번호' ;	
    key txn_type_code       : String(30)    not null @title: '거래유형코드' ;	
    key table_name          : String(50)    not null @title: '테이블명' ;	
    key column_name         : String(50)    not null @title: '컬럼명' ;	

    tplm : Association to tplm
            on tplm.tenant_id = tenant_id 
            and tplm.pr_template_number  =  pr_template_number;  

        hide_column_flag    : Boolean       not null @cds.on.insert: false  @title: '숨김컬럼여부' ;	
        display_column_flag : Boolean       not null @cds.on.insert: false  @title: '조회컬럼여부' ;	
        mandatory_column_flag : Boolean     not null @cds.on.insert: false  @title: '필수컬럼여부' ;	
        input_column_flag   : Boolean       not null @cds.on.insert: false  @title: '입력컬럼여부' ;
        default_value       : String(100)                                   @title: '기본값' ;	
        use_flag            : Boolean       not null @cds.on.insert: false  @title: '사용여부' ;			
    }	

extend Pu_Pr_Template_Dtl with util.Managed;    

