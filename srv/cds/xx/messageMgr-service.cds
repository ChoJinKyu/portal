using {xx as msgMgr} from '../../../db/cds/xx/messageMgr/XX_MESSAGE-model';

namespace xx;
@path : '/xx.msgMgrService'
service msgMgrService {
    entity Message as projection on msgMgr.Message;
}
