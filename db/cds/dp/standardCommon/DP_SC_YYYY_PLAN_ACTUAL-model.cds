namespace dp;	
using util from '../../util/util-model';  	
// using {dp as yyyyPlanActual} from '../standardCommon/DP_SC_YYYY_PLAN_ACTUAL-model';	
using {dp as planActual} from '../standardCommon/DP_SC_PLAN_ACTUAL_SUM-model';	

entity Sc_Yyyy_Plan_Actual {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key yyyy : String(4)  not null @title: '년도' ;	

    children: Composition of many planActual.Sc_Plan_Actual_Sum
        on children.tenant_id = tenant_id 
        and children.company_code = company_code
        and children.org_type_code = org_type_code
        and children.org_code = org_code
        and children.yyyy = yyyy;

    yyyy_plan_summary : String(2000)   @title: '년간계획요약' ;	
    planner : String(200)   @title: '계획담당자' ;	
    progress_status : String(20)   @title: '진행상태' ;	
    remark : String   @title: '비고' ;	
    plan_attachments : String(2000)   @title: '계획 첨부파일' ;	
    actual_attachments : String(2000)   @title: '실적 첨부파일' ;	
}	
extend Sc_Yyyy_Plan_Actual with util.Managed;	
