using {dp as pjt} from '../../../../../db/cds/dp/tc/DP_TC_PROJECT-model';
using {dp as pjtEvt} from '../../../../../db/cds/dp/tc/DP_TC_PROJECT_EVENT-model';
using {dp as pjtExrate} from '../../../../../db/cds/dp/tc/DP_TC_PROJECT_BASE_EXRATE-model';
using {dp as pjtSimilarModel} from '../../../../../db/cds/dp/tc/DP_TC_PROJECT_SIMILAR_MODEL-model';
using {dp as pjtAddInfo} from '../../../../../db/cds/dp/tc/DP_TC_PROJECT_ADDITION_INFO-model';
using {cm as codeDtl} from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using {cm as codeLng} from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using {cm as hrEmployee} from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using {cm as hrDept} from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';
using {cm as orgDiv} from '../../../../../db/cds/cm/CM_ORG_DIVISION-model';

namespace dp;

@path : '/dp.ProjectMgtService'
service ProjectMgtService {
    entity Project as projection on pjt.Tc_Project;
    entity ProjectEvent as projection on pjtEvt.Tc_Project_Event;
    entity ProjectExrate as projection on pjtExrate.Tc_Project_Base_Exrate;
    entity ProjectSimilarModel as projection on pjtSimilarModel.Tc_Project_Similar_Model;
    entity ProjectAddInfo as projection on pjtAddInfo.Tc_Project_Addition_Info;

    @readonly
    entity Code_Dtl                as
        select from codeDtl.Code_Dtl as d {
            key tenant_id,
            key group_code,
            key code,
                (
                    select code_name from codeLng.Code_Lng l
                    where
                            l.tenant_id   = d.tenant_id
                        and l.group_code  = d.group_code
                        and l.code        = d.code
                        and l.language_cd = 'KO'
                ) as code_name : String(240),
                code_description,
                sort_no
        }
        where
            $now between start_date and end_date;

    @readonly
    entity Hr_Employee             as projection on hrEmployee.Hr_Employee;

    @readonly
    entity Hr_Department            as projection on hrDept.Hr_Department;    

    @readonly
    entity Org_Division            as projection on orgDiv.Org_Division;
    
}
