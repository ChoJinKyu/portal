using { cm as roleMgr } from '../../../../db/cds/cm/roleMgr/CM_ROLE-model';

namespace cm;

service roleMgrService {

    entity Role as projection on roleMgr.Role;

}