using {xx as Master} from '../../../db/cds/xx/sampleV2Test/XX_SAMPLE_V2_M-model';
using {xx as Header} from '../../../db/cds/xx/sampleV2Test/XX_SAMPLE_V2_H-model';
using {xx as Detail} from '../../../db/cds/xx/sampleV2Test/XX_SAMPLE_V2_D-model';
using {xx as Tail} from '../../../db/cds/xx/sampleV2Test/XX_SAMPLE_V2_T-model';
using {xx as MasterF} from '../../../db/cds/xx/sampleMstMgr/XX_SAMPLE_MASTER_FUNC-model';

namespace xx;
@path : '/xx.SampleV2TestService'
service SampleV2TestService {

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
}