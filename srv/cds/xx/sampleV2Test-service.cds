using {xx as Master} from '../../../db/cds/xx/sampleV2Test/XX_SAMPLE_V2_M-model';
using {xx as Header} from '../../../db/cds/xx/sampleV2Test/XX_SAMPLE_V2_H-model';
using {xx as Detail} from '../../../db/cds/xx/sampleV2Test/XX_SAMPLE_V2_D-model';
using {xx as Tail} from '../../../db/cds/xx/sampleV2Test/XX_SAMPLE_V2_T-model';
using {xx as MasterF} from '../../../db/cds/xx/sampleMstMgr/XX_SAMPLE_MASTER_FUNC-model';

using {cm.Hr_Employee as employee} from '../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using {cm.User as user} from '../../../db/cds/cm/CM_USER-model';
using {cm.Hr_Department as Dept} from '../../../db/cds/cm/CM_HR_DEPARTMENT-model';


namespace xx;
@path : '/xx.SampleV2TestService'
//service SampleV2TestService  @(requires: ['SppBasic']){
service SampleV2TestService  {

    entity SampleV2Master as projection on Master.Sample_V2_M;
    entity SampleV2Header as projection on Header.Sample_V2_H;
    entity SampleV2Detail as projection on Detail.Sample_V2_D;
    entity SampleV2Tail   as projection on Tail.Sample_V2_T;

    view SampleV2MasterView (p_m_cd: String, p_m_name: String) as
    select key m.m_id
          ,m.m_cd
          ,m.m_name
    from   Master.Sample_V2_M as m
    where  m.m_cd = :p_m_cd
    and    m.m_name = :p_m_name
    ;


    entity SampleV2MasterFunc(CD : String) as select from MasterF.Sample_Master_Func(CD: :CD);

    entity Employee2 as select from employee mixin {
        DeptInfo: Association to Dept on department_id = DeptInfo.department_id and tenant_id = DeptInfo.tenant_id;
    } into {
        tenant_id,
        employee_number,
        email_id,
        mobile_phone_number,
        job_title,
        DeptInfo.department_local_name,
        DeptInfo.department_id
    }
}