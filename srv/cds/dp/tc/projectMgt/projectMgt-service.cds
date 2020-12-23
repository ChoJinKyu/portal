using {dp as pjt} from '../../../../../db/cds/dp/tc/DP_TC_PROJECT-model';
using {dp as pjtEvt} from '../../../../../db/cds/dp/tc/DP_TC_PROJECT_EVENT-model';
using {dp as pjtExrate} from '../../../../../db/cds/dp/tc/DP_TC_PROJECT_BASE_EXRATE-model';
using {dp as pjtSimilarModel} from '../../../../../db/cds/dp/tc/DP_TC_PROJECT_SIMILAR_MODEL-model';
using {dp as pjtAddInfo} from '../../../../../db/cds/dp/tc/DP_TC_PROJECT_ADDITION_INFO-model';
using {dp as pjtView} from '../../../../../db/cds/dp/tc/DP_TC_PROJECT_VIEW-model';

namespace dp;

@path : '/dp.ProjectMgtService'
service ProjectMgtService {
    entity Project as projection on pjt.Tc_Project;
    entity ProjectEvent as projection on pjtEvt.Tc_Project_Event;
    entity ProjectExrate as projection on pjtExrate.Tc_Project_Base_Exrate;
    entity ProjectSimilarModel as projection on pjtSimilarModel.Tc_Project_Similar_Model;
    entity ProjectAddInfo as projection on pjtAddInfo.Tc_Project_Addition_Info;

    view ProjectView @(title : 'Project View') as select from pjtView.TC_Project_View;

}
