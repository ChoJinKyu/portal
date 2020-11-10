namespace util;

using { cm as codeDtl } from '../../../../db/cds/cm/codeMgr/CM_CODE_DTL-model';
using { cm as codeLng } from '../../../../db/cds/cm/codeMgr/CM_CODE_LNG-model';

@path : '/util.CommonService'
service CommonServiceService {

    entity CodeDetails as projection on codeDtl.Code_Dtl;

}
