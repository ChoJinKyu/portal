using {tmp as TMP_EMP} from '../../../db/cds/tmp/TMP_EMP-model';
using {tmp as TMP_PRJT} from '../../../db/cds/tmp/TMP_PRJT-model';
using {tmp as TMP_CC_CONFIG001} from '../../../db/cds/tmp/TMP_CC_CONFIG001';
using {tmp as TMP_BIZRULE} from '../../../db/cds/tmp/TMP_BIZRULE_INFO';
using {tmp as TMP_CC_CONFIG002} from '../../../db/cds/tmp/TMP_CC_CONFIG002';
using {tmp as TMP_CC_CONFIG003} from '../../../db/cds/tmp/TMP_CC_CONFIG003';
using {tmp as TMP_CC_CONFIG004} from '../../../db/cds/tmp/TMP_CC_CONFIG004';

namespace tmp;
@path : '/tmp.TmpMgrService'
service TmpMgrService {
    entity Emp as projection on TMP_EMP.emp;
    entity prjt as projection on TMP_PRJT.prjt;
    entity tmpCcConfig001 as projection on TMP_CC_CONFIG001.CC_CONFIG001;
    entity bizruleInfo as projection on TMP_BIZRULE.bizrule_info;

    view tmpCcConfigView as
        SELECT 
            key a.TENANT_ID,
            key a.SCR_TMPL_ID,
            a.SCR_COL_GROUP_ID,
            c.SCR_COL_GROUP_NAME,
            c.GROUP_DP_SEQ,
            c.GROUP_DP_YN,
            a.META_ATTR_ID,
            b.COL_ID,
            b.COL_NAME,
            a.SCR_COL_NAME,
            a.SCR_COL_DESC,
            a.SCR_COL_IN_TYPE,
            a.SCR_COL_REQUIRE_YN,
            a.SCR_COL_DP_SEQ,
            a.SCR_COL_DP_TYPE,
            a.SCR_COL_DP_SIZE,
            a.SCR_COL_DEFALT,
            b.DATA_TYPE,
            b.DATE_LEN,
            b.COMMON_GROUP_CODE,
            b.OWNER_TABLE_ID,
            d.FORM_TYPE,
            a.SCR_COL_ADTNL_OPTNS,
            d.FORM_ADTNL_OPTNS
        FROM TMP_CC_CONFIG004.CC_CONFIG004 a, TMP_CC_CONFIG003.CC_CONFIG003 b,TMP_CC_CONFIG002.CC_CONFIG002 c, TMP_CC_CONFIG001.CC_CONFIG001 d
        where a.META_ATTR_ID = b.META_ATTR_ID 
        and   a.SCR_COL_GROUP_ID = c.SCR_COL_GROUP_ID 
        and   a.SCR_TMPL_ID = d.SCR_TMPL_ID
        and   a.SCR_TMPL_ID = c.SCR_TMPL_ID
        order by a.META_ATTR_ID,a.SCR_TMPL_ID,c.GROUP_DP_SEQ,a.SCR_COL_DP_SEQ ;


    type SampleType{
        TEMPLATE_PATH : String;
    };
    
    action SampleLogicTransition(TENANT_ID : String, TEMPLATE_ID: String) returns SampleType;

    //https://lg-common-dev-workspaces-ws-dvkxn-app1.jp10.applicationstudio.cloud.sap/tmp.TmpMgrService/CreateTemplateSample
    action CreateTemplateSample(TENANT_ID : String) returns String;    

    action RetrieveTemplateSample(TENANT_ID : String, TEMPLATE_ID: String) returns SampleType;

}