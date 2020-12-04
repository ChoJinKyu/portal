namespace cm.util;

using { cm as codeDtl } from '../../../../db/cds/cm/codeMgr/CM_CODE_DTL-model';
using { cm as codeLng } from '../../../../db/cds/cm/codeMgr/CM_CODE_LNG-model';
using { cm as msg } from '../../../../db/cds/cm/msgMgr/CM_MESSAGE-model';
using { cm as codeView } from '../../../../db/cds/cm/util/CM_CODE_VIEW-model';

@path : '/cm.util.CommonService'
service CommonService {

    entity CodeDetails as projection on codeDtl.Code_Dtl;
    entity Message as projection on msg.Message;
    entity CodeView as projection on codeView.Cm_Code_View;

}
