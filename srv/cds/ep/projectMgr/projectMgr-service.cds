using {ep as project} from '../../../../db/cds/ep/projectMgr/EP_PROJECT-model';

namespace ep;
@path : 'ep.projectMgrService'

service ProjectMgrService{

    entity Project as projection on project.Project;

}
