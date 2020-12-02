//Table
using {pg as idcCmpBsc} from '../../../../db/cds/pg/monitor/PG_MONITOR_INDICATOR_COMPARISON_BASIC-model';
using {pg as idcCond} from '../../../../db/cds/pg/monitor/PG_MONITOR_INDICATOR_CONDITION-model';
using {pg as idcGrd} from '../../../../db/cds/pg/monitor/PG_MONITOR_INDICATOR_GRADE-model';
using {pg as mntrAttcm} from '../../../../db/cds/pg/monitor/PG_MONITOR_ATTACHMENTS-model';
using {pg as mntrCycle} from '../../../../db/cds/pg/monitor/PG_MONITOR_CYCLE-model';
using {pg as mntrIdc} from '../../../../db/cds/pg/monitor/PG_MONITOR_INDICATOR-model';
using {pg as mntrManager} from '../../../../db/cds/pg/monitor/PG_MONITOR_MANAGER-model';
using {pg as mntrMaster} from '../../../../db/cds/pg/monitor/PG_MONITOR_MASTER-model';
using {pg as mntrOprtmd} from '../../../../db/cds/pg/monitor/PG_MONITOR_OPERATION_MODE-model';
using {pg as mntrSprt} from '../../../../db/cds/pg/monitor/PG_MONITOR_SEPARATED-model';
using {pg as mntrType} from '../../../../db/cds/pg/monitor/PG_MONITOR_TYPE-model';
using {pg as mntrSnar} from '../../../../db/cds/pg/monitor/PG_MONITOR_SCENARIO-model';
using {pg as mntrMasterHistMngt} from '../../../../db/cds/pg/monitor/PG_MONITOR_MASTER_HISTORY_MNGT-model';
using {pg as mntrFullMaster} from '../../../../db/cds/pg/monitor/PG_MONITOR_FULL_MASTER-model';
//View
using {pg as mntrMasterView} from '../../../../db/cds/pg/monitor/PG_MONITOR_MASTER_VIEW';
//CM ORG
using {cm.Org_Tenant as cmOrgTenant} from '../../../../db/cds/cm/orgMgr/CM_ORG_TENANT-model';
using {cm.Org_Company as cmOrgCompany} from '../../../../db/cds/cm/orgMgr/CM_ORG_COMPANY-model';
using {cm.Org_Unit as cmOrgUnit} from '../../../../db/cds/cm/orgMgr/CM_ORG_UNIT-model';
//CM Code
using {cm.Code_Mst as codeMst} from '../../../../db/cds/cm/codeMgr/CM_CODE_MST-model';
using {cm.Code_Dtl as codeDtl} from '../../../../db/cds/cm/codeMgr/CM_CODE_DTL-model';
using {cm.Code_Lng as codeLng} from '../../../../db/cds/cm/codeMgr/CM_CODE_LNG-model';
//Filte View
using {pg as MngView} from '../../../../db/cds/pg/monitor/PG_MONITOR_MANAGER_VIEW';
using {pg as EmpView} from '../../../../db/cds/pg/monitor/PG_MONITOR_EMPLOYEE_VIEW';
using {pg as JobTView} from '../../../../db/cds/pg/monitor/PG_MONITOR_JOB_TITLE_VIEW';
using {pg as MPNumbView} from '../../../../db/cds/pg/monitor/PG_MONITOR_MOBILE_PHONE_NUMBER_VIEW';
using {pg as DepartView} from '../../../../db/cds/pg/monitor/PG_MONITOR_DEPARTMENT_VIEW';
using {pg as OperatMdView} from '../../../../db/cds/pg/monitor/PG_MONITOR_OPERATION_MODE_VIEW';

namespace pg;

@path : '/pg.monitorService'
service monitorService {

    // Entity List
    entity IndicatorComparisonBasic @(title : '모니터링 지표 비교기준')            as projection on idcCmpBsc.Monitor_Indicator_Comparison_Basic;
    entity IndicatorCondition @(title : '모니터링 지표 조건')                    as projection on idcCond.Monitor_Indicator_Condition;
    entity IndicatorGrade @(title : '모니터링 지표 등급')                        as projection on idcGrd.Monitor_Indicator_Grade;
    entity MonitoringAttachments @(title : '모니터링 첨부파일')                  as projection on mntrAttcm.Monitor_Attachments;
    entity MonitoringCycle @(title : '모니터링 주기')                          as projection on mntrCycle.Monitor_Cycle;
    entity MonitoringIndicator @(title : '모니터링 지표')                      as projection on mntrIdc.Monitor_Indicator;
    entity MonitoringManager @(title : '모니터링 담당자')                       as projection on mntrManager.Monitor_Manager;
    entity MonitoringMaster @(title : '모니터링 마스터')                        as projection on mntrMaster.Monitor_Master;
    entity MonitoringOperationMode @(title : '모니터링 운영방식')                as projection on mntrOprtmd.Monitor_Operation_Mode;
    entity MonitoringSeparated @(title : '모니터링 구분')                      as projection on mntrSprt.Monitor_Separated;
    entity MonitoringType @(title : '모니터링 유형')                           as projection on mntrType.Monitor_Type;
    entity MonitoringSenario @(title : '모니터링 시나리오')                      as projection on mntrSnar.Monitor_Scenario;
    entity MonitoringMasterHistoryManagement @(title : '모니터링 마스터 이력 관리') as projection on mntrMasterHistMngt.Monitor_Master_History_Mngt;
    // View List
    view MonitoringMasterView @(title : '모니터링 마스터 View') as select from mntrMasterView.monitor_master_view;
    view ManagerView @(title : '담당자 전체 View') as select from MngView.Monitor_Manager_View;
    view EmployeeView @(title : '담당자 View') as select from EmpView.Monitor_Employee_View;
    view JobTitleView @(title : '직무 View') as select from JobTView.Monitor_Job_Title_View;
    view MobilePhoneNumberView @(title : '휴대폰번호 View') as select from MPNumbView.Monitor_Mobile_Phone_Number_View;
    view DepartmentView @(title : '부서 View') as select from DepartView.Monitor_Department_View;
    view OperationModeView @(title : '운영모드 View') as select from OperatMdView.Monitor_Operation_Mode_View;

    // Test List
    entity MonitoringFullMaster @(title : '모니터링 전체 마스터')                 as projection on mntrFullMaster.Monitor_Full_Master {
        * , linkToTenantID : redirected to OrgTenant, linkToCompanyCode : redirected to OrgCompany, linkToBizunitCode : redirected to OrgUnit
    };

    // Tenant View: 회사
    entity OrgTenant @(title : '회사 마스터 View') as
        select
            key tenant_id,
                tenant_name
        from cmOrgTenant
        where
            use_flag = 'true';

    // Company View: 법인
    entity OrgCompany @(title : '법인 마스터 View') as
        select
            key tenant_id,
            key company_code,
                company_name
        from cmOrgCompany
        where
            use_flag = 'true';

    // Unit View: 사업부분
    entity OrgUnit @(title : '사업부분 마스터 View') as
        select
            key tenant_id,
            key bizunit_code,
                bizunit_name
        from cmOrgUnit
        where
            use_flag = 'true';

    // Separated View: 구분
    view MonitoringSeparatedView @(title : '모니터링 구분 View') as
        select
            key tenant_id,
            key code,
                code_name
        from codeLng
        where
                group_code  = 'PG_MONITOR_SEPARATED'
            and language_cd = 'KO';

    // Type View: 유형
    view MonitoringTypeView @(title : '모니터링 유형 View') as
        select
            key tenant_id,
            key code,
                code_name
        from codeLng
        where
                group_code  = 'PG_MONITOR_TYPE'
            and language_cd = 'KO';

    // Activate/Inactivate View: 활성화/비활성화
    view MonitoringActInactView @(title : '모니터링 활성화/비활성화 View') as
        select
            key tenant_id,
            key code,
                code_name
        from codeLng
        where
                group_code  = 'PG_MONITOR_ACT_INACT_FLAG'
            and language_cd = 'KO';

    // Cycle View: 주기
    view MonitoringCycleView @(title : '모니터링 주기 View') as
        select
            key tenant_id,
            key code,
                code_name
        from codeLng
        where
                group_code  = 'PG_MONITOR_CYCLE'
            and language_cd = 'KO';

    // Indicate Comparision Basic View: 지표 비교기준
    view MonitoringIndCompBasicView @(title : '모니터링 지표 비교기준 View') as
        select
            key tenant_id,
            key code,
                code_name
        from codeLng
        where
                group_code  = 'PG_MONITOR_IND_COMP_BASIC'
            and language_cd = 'KO';

    // Indicate Comparision Condition View: 지표 조건
    view MonitoringIndCompCondView @(title : '모니터링 지표 조건 View') as
        select
            key tenant_id,
            key code,
                code_name
        from codeLng
        where
                group_code  = 'PG_MONITOR_IND_COMP_CONDITION'
            and language_cd = 'KO';

    // Indicate Comparision Grade View: 지표 등급
    view MonitoringIndCompGradeView @(title : '모니터링 지표 등급 View') as
        select
            key tenant_id,
            key code,
                code_name
        from codeLng
        where
                group_code  = 'PG_MONITOR_IND_COMP_GRADE'
            and language_cd = 'KO';


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
