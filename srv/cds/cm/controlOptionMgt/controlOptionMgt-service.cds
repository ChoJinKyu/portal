using {cm as controlOptionMgt} from '../../../../db/cds/cm/CM_CONTROL_OPTION_DTL-model';

namespace cm;

@path : '/cm.ControlOptionMgtService'
service ControlOptionMgtService {

  entity ControlOptionMasters as projection on controlOptionMgt.Control_Option_Mst;
  entity ControlOptionDetails as projection on controlOptionMgt.Control_Option_Dtl;

}
