using {pg as idcCmpBsc} from '../../../../db/cds/pg/monitor/PG_MONITOR_IDC_CMP_BSC-model';
using {pg as idcCond} from '../../../../db/cds/pg/monitor/PG_MONITOR_IDC_COND-model';
using {pg as idcGrd} from '../../../../db/cds/pg/monitor/PG_MONITOR_IDC_GRD-model';
using {pg as mntrAttcmMngt} from '../../../../db/cds/pg/monitor/PG_MONITOR_MNTR_ATTCM_MNGT-model';
using {pg as mntrCycleMngt} from '../../../../db/cds/pg/monitor/PG_MONITOR_MNTR_CYCLE_MNGT-model';
using {pg as mntrIdcMngt} from '../../../../db/cds/pg/monitor/PG_MONITOR_MNTR_IDC_MNGT-model';
using {pg as mntrManagerMngt} from '../../../../db/cds/pg/monitor/PG_MONITOR_MNTR_MANAGER_MNGT-model';
using {pg as mntrMaster} from '../../../../db/cds/pg/monitor/PG_MONITOR_MNTR_MASTER-model';
using {pg as mntrOprtmdMngt} from '../../../../db/cds/pg/monitor/PG_MONITOR_MNTR_OPRTMD_MNGT-model';
using {pg as mntrSprt} from '../../../../db/cds/pg/monitor/PG_MONITOR_MNTR_SPRT-model';
using {pg as mntrSrcSysMngt} from '../../../../db/cds/pg/monitor/PG_MONITOR_MNTR_SRC_SYS_MNGT-model';
using {pg as mntrTypeMngt} from '../../../../db/cds/pg/monitor/PG_MONITOR_MNTR_TYPE_MNGT-model';
using {pg as mntrMasterView} from '../../../../db/cds/pg/monitor/PG_MONITOR_MASTER_VIEW';
//Test
using {pg as mntrTest} from '../../../../db/cds/pg/monitor/PG_MONITOR_TEST-model';

namespace pg;

@path : '/pg.monitorService'
service monitorService {

    // Entity List
    entity IndicatorComparisonBasic           as projection on idcCmpBsc.Monitor_Idc_Cmp_Bsc_Mst;
    entity IndicatorCondition                 as projection on idcCond.Monitor_Idc_Cond_Mst;
    entity IndicatorGrade                     as projection on idcGrd.Monitor_Idc_Grd_Mst;
    entity MonitoringAttachmentsManagement    as projection on mntrAttcmMngt.Monitor_Mntr_Attcm_Mngt;
    entity MonitoringCycleManagement          as projection on mntrCycleMngt.Monitor_Mntr_Cycle_Mngt;
    entity MonitoringIndicatorManagement      as projection on mntrIdcMngt.Monitor_Mntr_Idc_Mngt;
    entity MonitoringManagerManagement        as projection on mntrManagerMngt.Monitor_Mntr_Manager_Mngt;
    entity MonitoringMaster                   as projection on mntrMaster.Monitor_Mntr_Mst;
    entity MonitoringOperationMode_Management as projection on mntrOprtmdMngt.Monitor_Mntr_Oprtmd_Mngt;
    entity MonitoringSeparated                as projection on mntrSprt.Monitor_Mntr_Sprt_Mst;
    entity MonitoringSourceSystemManagement   as projection on mntrSrcSysMngt.Monitor_Mntr_Src_Sys_Mngt;
    entity MonitoringTypeManagement           as projection on mntrTypeMngt.Monitor_Mntr_Type_Mngt;
    // Test Entry List
    entity MonitorTest as projection on mntrTest.Monitor_Test;
    // View List
    view MonitoringMasterView as select from mntrMasterView.monitor_master_view;

    // annotate monitorService.IndicatorComparisonBasic with @(UI : {
    //     HeaderInfo      : {
    //         TypeName       : '지표 비교기준 마스터',
    //         TypeNamePlural : '지표 비교기준',
    //         Title          : {
    //             $Type : 'UI.DataField',
    //             Value : tenant_id
    //         }
    //     },
    //     SelectionFields : [
    //     tenant_id,
    //     indicator_comparison_basic,
    //     language_code,
    //     indicator_comparison_basic_text,
    //     local_create_dtm,
    //     local_update_dtm,
    //     create_user_id,
    //     update_user_id,
    //     system_create_dtm,
    //     system_update_dtm
    //     ],
    //     LineItem        : [
    //     {
    //         $Type : 'UI.DataField',
    //         Value : tenant_id
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : indicator_comparison_basic
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : language_code
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : indicator_comparison_basic_text
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : local_create_dtm
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : local_update_dtm
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : create_user_id
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : update_user_id
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : system_create_dtm
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : system_update_dtm
    //     }
    //     ],
    // });

    // annotate CatalogService.Employees with {
    //     tenant_id                       @(Label : '테넌트ID');
    //     indicator_comparison_basic      @(Label : '지표 비교기준');
    //     language_code                   @(Label : '언어코드');
    //     indicator_comparison_basic_text @(Label : '지표 비교기준내역');
    //     local_create_dtm                @(Label : '로컬등록시간');
    //     local_update_dtm                @(Label : '로컬수정시간');
    //     create_user_id                  @(Label : '등록사용자ID');
    //     update_user_id                  @(Label : '변경사용자ID');
    //     system_create_dtm               @(Label : '시스템등록시간');
    //     system_update_dtm               @(Label : '시스템수정시간');
    // }

    // annotate monitorService.IndicatorCondition with @(UI : {
    //     HeaderInfo      : {
    //         TypeName       : '지표조건 마스터',
    //         TypeNamePlural : '지표조건',
    //         Title          : {
    //             $Type : 'UI.DataField',
    //             Value : tenant_id
    //         }
    //     },
    //     SelectionFields : [
    //     tenant_id,
    //     indicator_condition,
    //     language_code,
    //     indicator_condition_text,
    //     local_create_dtm,
    //     local_update_dtm,
    //     create_user_id,
    //     update_user_id,
    //     system_create_dtm,
    //     system_update_dtm
    //     ],
    //     LineItem        : [
    //     {
    //         $Type : 'UI.DataField',
    //         Value : tenant_id
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : indicator_condition
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : language_code
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : indicator_condition_text
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : local_create_dtm
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : local_update_dtm
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : create_user_id
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : update_user_id
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : system_create_dtm
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : system_update_dtm
    //     }
    //     ],
    // });

    // annotate CatalogService.Employees with {
    //     tenant_id                @(Label : '테넌트ID');
    //     indicator_condition      @(Label : '지표조건');
    //     language_code            @(Label : '언어코드');
    //     indicator_condition_text @(Label : '지표조건내역');
    //     local_create_dtm         @(Label : '로컬등록시간');
    //     local_update_dtm         @(Label : '로컬수정시간');
    //     create_user_id           @(Label : '등록사용자ID');
    //     update_user_id           @(Label : '변경사용자ID');
    //     system_create_dtm        @(Label : '시스템등록시간');
    //     system_update_dtm        @(Label : '시스템수정시간');
    // }

    // annotate monitorService.IndicatorGrade with @(UI : {
    //     HeaderInfo      : {
    //         TypeName       : '지표등급 마스터',
    //         TypeNamePlural : '지표등급',
    //         Title          : {
    //             $Type : 'UI.DataField',
    //             Value : tenant_id
    //         }
    //     },
    //     SelectionFields : [
    //     tenant_id,
    //     indicator_grade,
    //     language_code,
    //     indicator_grade_text,
    //     local_create_dtm,
    //     local_update_dtm,
    //     create_user_id,
    //     update_user_id,
    //     system_create_dtm,
    //     system_update_dtm
    //     ],
    //     LineItem        : [
    //     {
    //         $Type : 'UI.DataField',
    //         Value : tenant_id
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : indicator_grade
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : language_code
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : indicator_grade_text
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : local_create_dtm
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : local_update_dtm
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : create_user_id
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : update_user_id
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : system_create_dtm
    //     },
    //     {
    //         $Type : 'UI.DataField',
    //         Value : system_update_dtm
    //     }
    //     ],
    // });

    // annotate CatalogService.Employees with {
    //     tenant_id            @(Label : '테넌트ID');
    //     indicator_grade      @(Label : '지표등급');
    //     language_code        @(Label : '언어코드');
    //     indicator_grade_text @(Label : '지표등급내역');
    //     local_create_dtm     @(Label : '로컬등록시간');
    //     local_update_dtm     @(Label : '로컬수정시간');
    //     create_user_id       @(Label : '등록사용자ID');
    //     update_user_id       @(Label : '변경사용자ID');
    //     system_create_dtm    @(Label : '시스템등록시간');
    //     system_update_dtm    @(Label : '시스템수정시간');
    // }


}
