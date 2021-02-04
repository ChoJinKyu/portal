using {dp as mcstPjt} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT-model';
using {dp as mcstPjtEvt} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_EVENT-model';
using {dp as mcstPjtExrate} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_BASE_EXRATE-model';
using {dp as mcstPjtSimilarModel} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_SIMILAR_MODEL-model';
using {dp as mcstPjtAddInfo} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_ADDITION_INFO-model';
using {cm as codeDtl} from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using {cm as codeLng} from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using {cm as hrEmployee} from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using {cm as hrDept} from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';
using {cm as orgDiv} from '../../../../../db/cds/cm/CM_ORG_DIVISION-model';
using {dp as unitOfMeasure} from '../../../../../db/cds/dp/mm/DP_MM_UNIT_OF_MEASURE-model';
using {cm as currency} from '../../../../../db/cds/cm/CM_CURRENCY-model';

namespace dp;

@path : '/dp.McstProjectMgtService'
service McstProjectMgtService {
    entity McstProject             as projection on mcstPjt.Tc_Mcst_Project;
    entity McstProjectEvent        as projection on mcstPjtEvt.Tc_Mcst_Project_Event;
    entity McstProjectExrate       as projection on mcstPjtExrate.Tc_Mcst_Project_Base_Exrate;
    entity McstProjectSimilarModel as projection on mcstPjtSimilarModel.Tc_Mcst_Project_Similar_Model;
    entity McstProjectAddInfo      as projection on mcstPjtAddInfo.Tc_Mcst_Project_Addition_Info;

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

    //@readonly
    //entity Hr_Department            as projection on hrDept.Hr_Department;    

    @readonly
    entity Org_Division            as projection on orgDiv.Org_Division;

    @readonly
    entity MM_UOM                as
        select from unitOfMeasure.Mm_Unit_Of_Measure as d {
            key tenant_id,
            key uom_code,
                uom_name,
                uom_desc
        }
        where uom_desc is not null
          and disable_date is null
          //and uom_class_code = 'AAAADL'
          ;

    @readonly
    entity Currency as
        select from currency.Currency as c{
            key tenant_id,
            key currency_code
        }
        where use_flag = true;
}
