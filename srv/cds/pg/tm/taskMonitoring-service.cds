//Table
using {pg as TskMntrAttcmDtl} from '../../../../db/cds/pg/tm/PG_TM_ATTACHMENTS_DTL-model';
using {pg as TskMntrBzuCode} from '../../../../db/cds/pg/tm/PG_TM_BIZUNIT_CODE-model';
using {pg as TskMntrCmpCode} from '../../../../db/cds/pg/tm/PG_TM_COMP_CODE-model';
using {pg as TskMntrCylCodeLng} from '../../../../db/cds/pg/tm/PG_TM_CYCLE_CODE_LNG-model';
using {pg as TskMntrIdcNumDtl} from '../../../../db/cds/pg/tm/PG_TM_INDICATOR_NUMBER_DTL-model';
using {pg as TskMntrMngDtl} from '../../../../db/cds/pg/tm/PG_TM_MANAGER_DTL-model';
using {pg as TskMntrMstHstMngt} from '../../../../db/cds/pg/tm/PG_TM_MASTER_HISTORY_MNGT-model';
using {pg as TskMntrMaster} from '../../../../db/cds/pg/tm/PG_TM_MASTER-model';
using {pg as TskMntrOprtMdCodeLng} from '../../../../db/cds/pg/tm/PG_TM_OPERATION_MODE_CODE_LNG-model';
using {pg as TskMntrSnrNumLng} from '../../../../db/cds/pg/tm/PG_TM_SCENARIO_NUMBER_LNG-model';
using {pg as TskMntrPurTpCodeLng} from '../../../../db/cds/pg/tm/PG_TM_PURCHASING_TYPE_CODE_LNG-model';
using {pg as TskMntrTpCodeLng} from '../../../../db/cds/pg/tm/PG_TM_TYPE_CODE_LNG-model';
//View
using {pg as TskMntrMstView} from '../../../../db/cds/pg/tm/PG_TM_MASTER_VIEW-model';
using {pg as TskMntrIndNumView} from '../../../../db/cds/pg/tm/PG_TM_INDICATOR_NUMBER_VIEW-model';
using {pg as TskMntrMaxSnrNumView} from '../../../../db/cds/pg/tm/PG_TM_MAX_SCENARIO_NUMBER_VIEW-model';
//CM ORG
using {cm.Org_Tenant as CommomOrgTenant} from '../../../../db/cds/cm/CM_ORG_TENANT-model';
using {cm.Org_Company as CommomOrgCompany} from '../../../../db/cds/cm/CM_ORG_COMPANY-model';
using {cm.Org_Unit as CommomOrgUnit} from '../../../../db/cds/cm/CM_ORG_UNIT-model';
//CM Code
using {cm.Code_Mst as codeMst} from '../../../../db/cds/cm/CM_CODE_MST-model';
using {cm.Code_Dtl as codeDtl} from '../../../../db/cds/cm/CM_CODE_DTL-model';
using {cm.Code_Lng as codeLng} from '../../../../db/cds/cm/CM_CODE_LNG-model';
//Filte View
using {pg as MngView} from '../../../../db/cds/pg/tm/PG_TM_MANAGER_VIEW-model';
using {pg as EmpView} from '../../../../db/cds/pg/tm/PG_TM_EMPLOYEE_VIEW-model';
using {pg as JobTView} from '../../../../db/cds/pg/tm/PG_TM_JOB_TITLE_VIEW-model';
using {pg as MPNumbView} from '../../../../db/cds/pg/tm/PG_TM_MOBILE_PHONE_NUMBER_VIEW-model';
using {pg as DepartView} from '../../../../db/cds/pg/tm/PG_TM_DEPARTMENT_VIEW-model';
//Test View
// using {pg as RwLmtest} from '../../../../db/cds/pg/tm/PG_TM_ROW_LIMIT_TEST-model';

namespace pg;

@cds.query.limit: { max: 99999 }
@path : '/pg.taskMonitoringService'
service taskMonitoringService {

    // Table List
    entity TaskMonitoringAttachmentsDetail @(title : '모니터링 첨부파일 상세') as projection on TskMntrAttcmDtl.Tm_Attachments_Dtl;
    entity TaskMonitoringBizunitCode @(title : '모니터링 사업본부코드') as projection on TskMntrBzuCode.Tm_Bizunit_Code;
    entity TaskMonitoringCompanyCode @(title : '모니터링 법인코드') as projection on TskMntrCmpCode.Tm_Comp_Code;
    entity TaskMonitoringCycleCodeLanguage @(title : '모니터링 주기코드 다국어') as projection on TskMntrCylCodeLng.Tm_Cycle_Code_Lng;
    entity TaskMonitoringIndicatorNumberDetail @(title : '모니터링 지표번호 상세') as projection on TskMntrIdcNumDtl.Tm_Indicator_Number_Dtl;
    entity TaskMonitoringManagerDetail @(title : '모니터링 담당자 상세') as projection on TskMntrMngDtl.Tm_Manager_Dtl;
    entity TaskMonitoringMasterHistoryManagement @(title : '모니터링 마스터 이력 관리') as projection on TskMntrMstHstMngt.Tm_Master_History_Mngt;
    entity TaskMonitoringMaster @(title : '모니터링 마스터') as projection on TskMntrMaster.Tm_Master;
    entity TaskMonitoringOperationModeLanguage @(title : '모니터링 운영방식 다국어') as projection on TskMntrOprtMdCodeLng.Tm_Operation_Mode_Code_Lng;
    entity TaskMonitoringSenarioNumberLanguage @(title : '모니터링 시나리오번호 다국어') as projection on TskMntrSnrNumLng.Tm_Scenario_Number_Lng;
    entity TaskMonitoringPurchasingTypeCodeLanguage @(title : '모니터링 구매유형코드 다국어') as projection on TskMntrPurTpCodeLng.Tm_Purchasing_Type_Code_Lng;
    entity TaskMonitoringTypeCodeLanguage @(title : '모니터링 구분코드 다국어') as projection on TskMntrTpCodeLng.Tm_Type_Code_Lng;
    // View List
    view TaskMonitoringMasterView @(title : '모니터링 마스터 View') as select from TskMntrMstView.Tm_Master_View;
    view TaskMonitoringManagerView @(title : '담당자 전체 View') as select from MngView.Tm_Manager_View;
    view TaskMonitoringEmployeeView @(title : '담당자 View') as select from EmpView.Tm_Employee_View;
    view TaskMonitoringJobTitleView @(title : '직무 View') as select from JobTView.Tm_Job_Title_View;
    view TaskMonitoringMobilePhoneNumberView @(title : '휴대폰번호 View') as select from MPNumbView.Tm_Mobile_Phone_Number_View;
    view TaskMonitoringDepartmentView @(title : '부서 View') as select from DepartView.Tm_Department_View;
    view TaskMonitoringIndicatorNumberView @(title : '모니터링 지표번호 정보 View') as select from TskMntrIndNumView.Tm_Indicator_Number_View;
    view TaskMonitoringMaxScenarioNumberView @(title : '최대 시나리오 Number View')as select from TskMntrMaxSnrNumView.Tm_Max_Scenario_Number_View;

    // Test List
    // entity MonitoringFullMaster @(title : '모니터링 전체 마스터')                 as projection on mntrFullMaster.Monitor_Full_Master {
    //     * , linkToTenantID : redirected to OrgTenant, linkToCompanyCode : redirected to OrgCompany, linkToBizunitCode : redirected to OrgUnit
    // };
    // @cds.query.limit: { default : 500, max: 100000 }
    // @readonly
    // view RowLimitTest as select from RwLmtest.Tm_Row_Limit_Test;

    // Tenant View
    view OrgTenantView @(title : '회사 마스터 View') as
        select
            key tenant_id,
                tenant_name
        from CommomOrgTenant
        where
            use_flag = 'true';

    // Company View
    view OrgCompanyView @(title : '법인 마스터 View') as
        select
            key tenant_id,
            key company_code,
                company_name
        from CommomOrgCompany
        where
            use_flag = 'true';

    // Biz Unit View
    view OrgUnitView @(title : '사업부분 마스터 View') as
        select
            key tenant_id,
            key bizunit_code,
                bizunit_name
        from CommomOrgUnit
        where
            use_flag = 'true';

    // Type View
    view TaskMonitoringTypedCodeView @(title : '모니터링 구분코드 View') as
        select
            key tenant_id,
            key code,
                code_name
        from codeLng
        where
                group_code  = 'PG_TM_TYPE_CODE'
            and language_cd = 'KO';

    // Purchaing Type View
    view TaskMonitoringPurchaingTypeCodeView @(title : '모니터링 구매유형코드 View') as
        select
            key tenant_id,
            key code,
                code_name
        from codeLng
        where
                group_code  = 'PG_TM_PURCHAING_TYPE_CODE'
            and language_cd = 'KO';

    // Activate Flag View
    view TaskMonitoringActivateFlagView @(title : '모니터링 활성화여부 View') as
        select
            key tenant_id,
            key code,
                code_name
        from codeLng
        where
                group_code  = 'PG_TM_ACTIVATE_FLAG'
            and language_cd = 'KO';

    // Operation Mode View
    view TaskMonitoringOperationModeView @(title : '모니터링 운영방식 View') as
        select
            key tenant_id,
            key scenario_number,
            key monitoring_operation_mode_code,
                monitoring_operation_mode_name,
                local_create_dtm,
                local_update_dtm,
                create_user_id,
                update_user_id,
                system_create_dtm,
                system_update_dtm
        from TaskMonitoringOperationModeLanguage
        where
            language_code = 'KO'
        order by
            tenant_id,
            scenario_number,
            monitoring_operation_mode_code;

    // Cycle View
    view TaskMonitoringCycleCodeView @(title : '모니터링 주기코드 View') as
        select
            key tenant_id,
            key code,
                code_name
        from codeLng
        where
                group_code  = 'PG_TM_CYCLE_CODE'
            and language_cd = 'KO';

    // Indicator Number Code View
    view TaskMonitoringIndicatorNumberCodeView @(title : '모니터링 지표번호코드 View') as
        select
            key tenant_id,
            key code,
                code_name
        from codeLng
        where
                group_code  = 'PG_TM_INDC_NUMBER_CODE'
            and language_cd = 'KO';

    // Indicator Comparision Basic Code View
    view TaskMonitoringIndicatorComparisionBasicCodeView @(title : '모니터링 지표비교기준코드 View') as
        select
            key tenant_id,
            key code,
                code_name
        from codeLng
        where
                group_code  = 'PG_TM_INDC_CMPR_BASIC_CODE'
            and language_cd = 'KO';

    // Indicator Comparision Condition Code View
    view TaskMonitoringIndicatorComparisonConditionCodeView @(title : '모니터링 지표조건코드 View') as
        select
            key tenant_id,
            key code,
                code_name
        from codeLng
        where
                group_code  = 'PG_TM_INDC_CMPR_CONDITION_CODE'
            and language_cd = 'KO';

    // Indicator Comparision Grade Code View
    view TaskMonitoringIndicatorComparisionGradeCodeView @(title : '모니터링 지표등급코드 View') as
        select
            key tenant_id,
            key code,
                code_name
        from codeLng
        where
                group_code  = 'PG_TM_INDC_CMPR_GRADE_CODE'
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
