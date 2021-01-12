namespace dp;

@path : '/dp.McstProjectMgtV4Service'
service McstProjectMgtV4Service {

    type InputDataType {
        tenant_id    : String(5);
        project_code : String(30);
        model_code   : String(40);
        mcst_code    : String(30);
        user_id      : String(255);
    }

    type OutputDataType : {
        version_number : String(30);
        return_code    : String(20);
        return_msg     : String(5000);
    };

    action TcCreateMcstProjectProc(inputData : InputDataType) returns OutputDataType;

}
