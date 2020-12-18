using { cm as msgMgt } from '../../../../db/cds/cm/CM_MESSAGE-model';

namespace cm;

service MsgMgtService {

    entity Message as projection on msgMgt.Message;

}