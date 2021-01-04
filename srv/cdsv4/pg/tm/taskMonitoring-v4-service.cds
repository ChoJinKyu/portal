//Using Table
// using {pg as TskMntrAttcmDtl} 		from '../../../../db/cds/pg/tm/PG_TM_ATTACHMENTS_DTL-model';
// using {pg as TskMntrBzuCode} 		from '../../../../db/cds/pg/tm/PG_TM_BIZUNIT_CODE-model';
// using {pg as TskMntrCmpCode} 		from '../../../../db/cds/pg/tm/PG_TM_COMP_CODE-model';
// using {pg as TskMntrCylCodeLng} 	from '../../../../db/cds/pg/tm/PG_TM_CYCLE_CODE_LNG-model';
// using {pg as TskMntrIdcNumDtl} 		from '../../../../db/cds/pg/tm/PG_TM_INDICATOR_NUMBER_DTL-model';
// using {pg as TskMntrMngDtl} 		from '../../../../db/cds/pg/tm/PG_TM_MANAGER_DTL-model';
// using {pg as TskMntrMstHstMngt}		from '../../../../db/cds/pg/tm/PG_TM_MASTER_HISTORY_MNGT-model';
// using {pg as TskMntrMaster} 		from '../../../../db/cds/pg/tm/PG_TM_MASTER-model';
// using {pg as TskMntrOprtMdCodeLng}	from '../../../../db/cds/pg/tm/PG_TM_OPERATION_MODE_CODE_LNG-model';
// using {pg as TskMntrSnrNumLng} 		from '../../../../db/cds/pg/tm/PG_TM_SCENARIO_NUMBER_LNG-model';
// using {pg as TskMntrPurTpCodeLng} 	from '../../../../db/cds/pg/tm/PG_TM_PURCHASING_TYPE_CODE_LNG-model';
// using {pg as TskMntrTpCodeLng} 		from '../../../../db/cds/pg/tm/PG_TM_TYPE_CODE_LNG-model';

namespace pg;

@path : '/pg.taskMonitoringV4Service'
service taskMonitoringV4Service {

    type taskMonitoringMaster : {
        tenant_id            : String(5);
        scenario_number      : Integer64;
        monitoring_type_code : String(30);
        activate_flag        : Boolean;
        monitoring_purpose   : LargeBinary;
        scenario_desc        : LargeBinary;
        source_system_desc   : LargeBinary;
        local_create_dtm     : DateTime;
        local_update_dtm     : DateTime;
        create_user_id       : String(255);
        update_user_id       : String(255);
        system_create_dtm    : DateTime;
        system_update_dtm    : DateTime;
    };

    type taskMonitoringCompany : {
        tenant_id         : String(5);
        scenario_number   : Integer64;
        company_code      : String(10);
        local_create_dtm  : DateTime;
        local_update_dtm  : DateTime;
        create_user_id    : String(255);
        update_user_id    : String(255);
        system_create_dtm : DateTime;
        system_update_dtm : DateTime;
    };

    type taskMonitoringBizunit : {
        tenant_id         : String(5);
        scenario_number   : Integer64;
        bizunit_code      : String(10);
        local_create_dtm  : DateTime;
        local_update_dtm  : DateTime;
        create_user_id    : String(255);
        update_user_id    : String(255);
        system_create_dtm : DateTime;
        system_update_dtm : DateTime;
    };

    type taskMonitoringManager : {
        tenant_id                       : String(5);
        scenario_number                 : Integer64;
        monitoring_manager_empno        : String(30);
        monitoring_super_authority_flag : Boolean;
        local_create_dtm                : DateTime;
        local_update_dtm                : DateTime;
        create_user_id                  : String(255);
        update_user_id                  : String(255);
        system_create_dtm               : DateTime;
        system_update_dtm               : DateTime;
    };

    type taskMonitoringOperation : {
        tenant_id                      : String(5);
        scenario_number                : Integer64;
        monitoring_operation_mode_code : String(30);
        language_code                  : String(10);
        monitoring_operation_mode_name : String(240);
        local_create_dtm               : DateTime;
        local_update_dtm               : DateTime;
        create_user_id                 : String(255);
        update_user_id                 : String(255);
        system_create_dtm              : DateTime;
        system_update_dtm              : DateTime;
    };

    type taskMonitoringPurchasingType : {
        tenant_id                       : String(5);
        scenario_number                 : Integer64;
        monitoring_purchasing_type_code : String(30);
        language_code                   : String(10);
        monitoring_purchasing_type_name : String(240);
        local_create_dtm                : DateTime;
        local_update_dtm                : DateTime;
        create_user_id                  : String(255);
        update_user_id                  : String(255);
        system_create_dtm               : DateTime;
        system_update_dtm               : DateTime;
    };

    type taskMonitoringScenario : {
        tenant_id         : String(5);
        scenario_number   : Integer64;
        language_code     : String(10);
        scenario_name     : String(240);
        local_create_dtm  : DateTime;
        local_update_dtm  : DateTime;
        create_user_id    : String(255);
        update_user_id    : String(255);
        system_create_dtm : DateTime;
        system_update_dtm : DateTime;
    };

    type taskMonitoringTypeCode : {
        tenant_id            : String(5);
        scenario_number      : Integer64;
        monitoring_type_code : String(30);
        language_code        : String(10);
        monitoring_type_name : String(240);
        local_create_dtm     : DateTime;
        local_update_dtm     : DateTime;
        create_user_id       : String(255);
        update_user_id       : String(255);
        system_create_dtm    : DateTime;
        system_update_dtm    : DateTime;
    };

    type upsertSourceType : {
        sourceMaster         : array of taskMonitoringMaster;
        sourceCompany        : array of taskMonitoringCompany;
        sourceBizunit        : array of taskMonitoringBizunit;
        sourceManager        : array of taskMonitoringManager;
        sourceOperation      : array of taskMonitoringOperation;
        sourcePurchasingType : array of taskMonitoringPurchasingType;
        sourceScenario       : array of taskMonitoringScenario;
        sourceTypeCode       : array of taskMonitoringTypeCode;
    };

    type upsertTargetType : {
        targetMaster         : array of taskMonitoringMaster;
        targetCompany        : array of taskMonitoringCompany;
        targetBizunit        : array of taskMonitoringBizunit;
        targetManager        : array of taskMonitoringManager;
        targetOperation      : array of taskMonitoringOperation;
        targetPurchasingType : array of taskMonitoringPurchasingType;
        targetScenario       : array of taskMonitoringScenario;
        targetTypeCode       : array of taskMonitoringTypeCode;
        targerMessage        : String;
    };

    action upsertTaskMonitoringMasterProc(InputData : upsertSourceType) returns upsertTargetType;

}
