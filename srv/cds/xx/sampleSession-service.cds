using cm.Spp_User_Session_View as Spp_User_Session_View from '../../../db/cds/cm/util/CM_SPP_USER_SESSION_VIEW-model';
using xx.Sample_Session_View as Sample_Session_View from '../../../db/cds/xx/sampleMgr/XX_SAMPLE_SESSION_VIEW-model';
using { cm.Code_View as cm_Code } from '../../../db/cds/cm/CM_CODE_VIEW-model';

namespace xx;
@path : '/xx.SampleSessionService'
service SampleSessionService {


    view SampleSessionView1 as
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
    join Spp_User_Session_View b on (a.tenant_id = b.TENANT_ID and a.language_cd = b.LANGUAGE_CODE)
    where a.group_code = 'CM_APPROVER_TYPE'
    ;

    view SampleSessionView2 as select from Sample_Session_View;

    view SampleSessionView3 @(restrict: [
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

    view SampleSessionView4 @(restrict: [
        { grant: 'READ', where: 'language_cd = $user.LANGUAGE_CODE' },
        { grant: 'READ', where: 'tenant_id = $user.TENANT_ID' }
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

    view UserValue as 
    select 
        key $user as USER :String
        ,$user.id as USER_ID :String
        ,$user.locale as USER_LOCALE :String
    from Spp_User_Session_View;
}
