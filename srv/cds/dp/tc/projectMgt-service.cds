using {dp as pjt} from '../../../../db/cds/dp/tc/DP_TC_PROJECT-model';
using {dp as pjtEvt} from '../../../../db/cds/dp/tc/DP_TC_PROJECT_EVENT-model';
using {dp as pjtMcstVer} from '../../../../db/cds/dp/tc/DP_TC_PROJECT_MCST_VERSION-model';
using {dp as pjtSimilarModel} from '../../../../db/cds/dp/tc/DP_TC_PROJECT_SIMILAR_MODEL-model';
using {dp as pjtView} from '../../../../db/cds/dp/tc/DP_TC_PROJECT_VIEW-model';

namespace dp;

@path : '/dp.ProjectMgtService'
service ProjectMgtService {
    entity Project as projection on dp.Tc_Project;
    entity ProjectEvent as projection on dp.Tc_Project_Event;
    entity ProjectMcstVer as projection on pjtMcstVer.Tc_Project_Mcst_Version;
    entity ProjectSimilarModel as projection on pjtSimilarModel.Tc_Project_Similar_Model;

    view Projects @(title : 'Project View') as select from pjtView.TC_Project_View;

}
