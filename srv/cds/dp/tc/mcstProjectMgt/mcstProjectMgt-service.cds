using {dp as mcstPjt} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT-model';
using {dp as mcstPjtEvt} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_EVENT-model';
using {dp as mcstPjtExrate} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_BASE_EXRATE-model';
using {dp as mcstPjtSimilarModel} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_SIMILAR_MODEL-model';
using {dp as mcstPjtAddInfo} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_ADDITION_INFO-model';
using {cm.Code_Dtl as codeDtl} from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using {cm.Code_Lng as codeLng} from '../../../../../db/cds/cm/CM_CODE_LNG-model';

namespace dp;

@path : '/dp.McstProjectMgtService'
service McstProjectMgtService {
    entity McstProject as projection on mcstPjt.Tc_Mcst_Project;
    entity McstProjectEvent as projection on mcstPjtEvt.Tc_Mcst_Project_Event;
    entity McstProjectExrate as projection on mcstPjtExrate.Tc_Mcst_Project_Base_Exrate;
    entity McstProjectSimilarModel as projection on mcstPjtSimilarModel.Tc_Mcst_Project_Similar_Model;
    entity McstProjectAddInfo as projection on mcstPjtAddInfo.Tc_Mcst_Project_Addition_Info;

    @readonly
    entity Code_Dtl as
        select from codeDtl as d {
            key tenant_id,
            key group_code,
            key code,
                (select code_name from codeLng l where l.tenant_id  = d.tenant_id
                        and l.group_code = d.group_code
                        and l.code = d.code
                        and l.language_cd = 'KO') as code_name: String(240),
                code_description,
                sort_no
        }
        where
            $now between start_date and end_date;
}
