namespace xx.util;

using { cm as codeDtl } from '../../../../db/cds/cm/codeMgr/CM_CODE_DTL-model';
using { cm as codeLng } from '../../../../db/cds/cm/codeMgr/CM_CODE_LNG-model';
using { xx as msg } from '../../../../db/cds/xx/template/XX_MESSAGE-model';

@path : '/xx.util.CommonService'
service CommonService {

    entity CodeDetails as projection on codeDtl.Code_Dtl;
    entity Message as projection on msg.Message;

}
