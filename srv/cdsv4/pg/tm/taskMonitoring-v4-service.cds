namespace pg;

@path : '/pg.TaskMonitoringV4Service'
service TaskMonitoringV4Service {

    type TaskMonitoringMaster : {
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

    type TaskMonitoringScenario : {
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

    type TaskMonitoringCompany : {
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

    type TaskMonitoringBizunit : {
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

    type TaskMonitoringPurchasingType : {
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

    type TaskMonitoringTypeCode : {
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

    type TaskMonitoringManager : {
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

    type TaskMonitoringOperation : {
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

    type TaskMonitoringCycle : {
        tenant_id             : String(5);
        scenario_number       : Integer64;
        monitoring_cycle_code : String(10);
        language_code         : String(10);
        monitoring_cycle_name : String(240);
        local_create_dtm      : DateTime;
        local_update_dtm      : DateTime;
        create_user_id        : String(255);
        update_user_id        : String(255);
        system_create_dtm     : DateTime;
        system_update_dtm     : DateTime;
    };

    type TaskMonitoringIndicator : {
        tenant_id                        : String(5);
        scenario_number                  : Integer64;
        monitoring_indicator_id          : Integer64;
        monitoring_indicator_sequence    : Integer64;
        monitoring_ind_number_cd         : String(30);
        monitoring_ind_condition_cd      : String(10);
        monitoring_indicator_start_value : String(100);
        monitoring_indicator_last_value  : String(100);
        monitoring_indicator_grade       : String(10);
        monitoring_ind_compare_base_cd   : String(30);
        local_create_dtm                 : DateTime;
        local_update_dtm                 : DateTime;
        create_user_id                   : String(255);
        update_user_id                   : String(255);
        system_create_dtm                : DateTime;
        system_update_dtm                : DateTime;
    };

    type UpsertInputType : {
        tenant_id            : String(5);
        sourceMaster         : array of TaskMonitoringMaster;
        sourceScenario       : array of TaskMonitoringScenario;
        sourceCompany        : array of TaskMonitoringCompany;
        sourceBizunit        : array of TaskMonitoringBizunit;
        sourcePurchasingType : array of TaskMonitoringPurchasingType;
        sourceTypeCode       : array of TaskMonitoringTypeCode;
        sourceManager        : array of TaskMonitoringManager;
        sourceOperation      : array of TaskMonitoringOperation;
        sourceCycle          : array of TaskMonitoringCycle;
        sourceIndicator      : array of TaskMonitoringIndicator;
    };

    type UpsertOutType : {
        returncode    : String(2);
        returnmessage : String(5000);
    };

    type DeleteInputType : {
        tenant_id       : String(5);
        scenario_number : Integer64;
    };

    type DeleteOutType : {
        returncode    : String(2);
        returnmessage : String(5000);
    };

    action upsertTaskMonitoringMasterProc(InputData : UpsertInputType) returns array of UpsertOutType;
    action deleteTaskMonitoringMasterProc(InputData : array of DeleteInputType) returns array of DeleteOutType;

}
