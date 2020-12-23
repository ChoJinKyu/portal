using {dp as mcstPjt} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT-model';
using {dp as mcstPjtEvt} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_EVENT-model';
using {dp as mcstPjtExrate} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_BASE_EXRATE-model';
using {dp as mcstPjtSimilarModel} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_SIMILAR_MODEL-model';
using {dp as mcstPjtAddInfo} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_ADDITION_INFO-model';

namespace dp;

@path : '/dp.McstProjectMgtService'
service ProjectMgtService {
    entity McstProject as projection on mcstPjt.Tc_Mcst_Project;
    entity McstProjectEvent as projection on mcstPjtEvt.Tc_Mcst_Project_Event;
    entity McstProjectSimilarModel as projection on mcstPjtSimilarModel.Tc_Mcst_Project_Similar_Model;
    entity McstProjectAddInfo as projection on mcstPjtAddInfo.Tc_Mcst_Project_Addition_Info;
}
