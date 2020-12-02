using {cm as controlOptionMgr} from '../../../../db/cds/cm/controlOptionMgr/CM_CONTROL_OPTION_DTL-model';

namespace cm;

@path : '/cm.ControlOptionMgrService'
service ControlOptionMgrService {

  entity ControlOptionMasters as projection on controlOptionMgr.Control_Option_Mst;
  entity ControlOptionDetails as projection on controlOptionMgr.Control_Option_Dtl;

}
