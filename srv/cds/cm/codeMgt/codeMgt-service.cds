using { cm as codeMst } from '../../../../db/cds/cm/CM_CODE_MST-model';
using { cm as codeDtl } from '../../../../db/cds/cm/CM_CODE_DTL-model';
using { cm as codeLng } from '../../../../db/cds/cm/CM_CODE_LNG-model';

namespace cm;
@path : '/cm.CodeMgtService'
service CodeMgtService {

    entity CodeMasters as projection on codeMst.Code_Mst;
    entity CodeDetails as projection on codeDtl.Code_Dtl;
    entity CodeLanguages as projection on codeLng.Code_Lng;

}
