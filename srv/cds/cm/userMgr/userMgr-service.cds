using { cm as userMgr } from '../../../../db/cds/cm/userMgr/CM_USER-model';

namespace cm;

service UserMgrService {

    entity UserMgr as projection on userMgr.User; 

}