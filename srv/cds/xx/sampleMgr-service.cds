using {xx as Header} from '../../../db/cds/xx/sampleMgr/XX_SAMPLE_HEADER-model';
using {xx as Detail} from '../../../db/cds/xx/sampleMgr/XX_SAMPLE_DETAIL-model';
using {xx as MgrView} from '../../../db/cds/xx/sampleMgr/XX_SAMPLE_MGR_VIEW-model';
using {xx as MasterF} from '../../../db/cds/xx/sampleMstMgr/XX_SAMPLE_MASTER_FUNC-model';
using {xx as deploy} from '../../../db/cds/xx/sampleMgr/XX_SAMPLE_DEPLOY-model';
using { cm.Code_View as cm_Code } from '../../../db/cds/cm/CM_CODE_VIEW-model';
namespace xx;
@path : '/xx.SampleMgrService'
service SampleMgrService {
    
    entity SampleHeaders as projection on Header.Sample_Header;
    entity SampleDetails as projection on Detail.Sample_Detail;
    entity SampleDeploy as projection on deploy.Sample_Deploy;

    // DB Object로 생성된 View를 조회 하는 경우 (model-cds가 존재해야함)
    view SampleMgrView as select from MgrView.Sample_Mgr_View;

    // model-cds의 entity를 join 하여 간단한 view 생성
    view SampleViewCud as 
    select key h.header_id
          ,h.cd as header_cd
          ,h.name as header_name
          ,d.detail_id
          ,d.cd as detail_cd
          ,d.name as detail_name
    from Header.Sample_Header as h 
    left join Detail.Sample_Detail as d on h.header_id = d.header_id
    ;

    view SampleSessionView @(restrict: [
        { grant: 'READ', where: 'language_cd = $user.LANGUAGE_CODE and tenant_id = $user.TENANT_ID' }
    ])  as
        select
            key a.tenant_id     as tenant_id,
            key a.group_code    as group_code,
            key a.language_cd   as language_cd,
            key a.code          as code,
            a.code_name         as code_name,
            a.parent_group_code as parent_group_code,
            a.parent_code       as parent_code,
            a.sort_no           as sort_no
        from cm_Code a
        where a.group_code = 'CM_APPROVER_TYPE'
    ;

    // Array로 하면 or 조건
    // view SampleSessionView @(restrict: [
    //     { grant: 'READ', where: 'language_cd = $user.LANGUAGE_CODE' },
    //     { grant: 'READ', where: 'tenant_id = $user.TENANT_ID' }
    // ])  as
    //     select
    //         key a.tenant_id     as tenant_id,
    //         key a.group_code    as group_code,
    //         key a.language_cd   as language_cd,
    //         key a.code          as code,
    //         a.code_name         as code_name,
    //         a.parent_group_code as parent_group_code,
    //         a.parent_code       as parent_code,
    //         a.sort_no           as sort_no
    //     from cm_Code a
    //     where a.group_code = 'CM_APPROVER_TYPE'
    // ;
}
