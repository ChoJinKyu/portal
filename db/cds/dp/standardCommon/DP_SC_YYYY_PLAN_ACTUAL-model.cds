namespace dp;	
using util from '../../util/util-model';  	
// using {dp as yyyyPlanActual} from '../standardCommon/DP_SC_YYYY_PLAN_ACTUAL-model';	
using {dp as planActual} from '../standardCommon/DP_SC_PLAN_ACTUAL_SUM-model';	

entity Sc_Yyyy_Plan_Actual {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  not null;	
  key org_type_code : String(30)  not null;	
  key org_code : String(10)  not null;	
  key yyyy : String(4)  not null;

    children: Composition of many planActual.Sc_Plan_Actual_Sum
        on children.tenant_id = tenant_id 
        and children.company_code = company_code
        and children.org_type_code = org_type_code
        and children.org_code = org_code
        and children.yyyy = yyyy;

    yyyy_plan_summary : String(2000)  ;	
    planner : String(200)  ;	
    progress_status : String(20)  ;	
    remark : String  ;	
    plan_attachments : String(2000)  ;	
    actual_attachments : String(2000)  ;	
}	
extend Sc_Yyyy_Plan_Actual with util.Managed;	
