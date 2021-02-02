namespace dp;

@path : '/dp.McstBomMgtV4Service'
service McstBomMgtV4Service {

    type OldTblData {
        material_code : String(40);
    }

    type NewTblData {
        material_code : String(40);
        change_reason : String(1000);
    }

    type CreateDataType : {
        tenant_id            : String(5);
        project_code         : String(30);
        model_code           : String(40);
        version_number       : String(30);
        user_id              : String(255);
        old_tbl              : array of OldTblData;
        new_tbl              : array of NewTblData;
        department_type_code : String(30);
        creator_empno        : String(30);
        eng_change_number    : String(30);
        change_reason        : String(1000);
    }

    type OutputData : {
        return_code : String(20);
        return_msg  : String(5000);
    };

    //재료비 프로젝트 BOM Mapping 생성
    action TcCreateMcstBomProc(inputData : CreateDataType) returns OutputData;

    type UpdateDataType : {
        tenant_id            : String(5);
        mapping_id           : Integer;
        user_id              : String(255);
        new_tbl              : array of NewTblData;
        department_type_code : String(30);
        creator_empno        : String(30);
        eng_change_number    : String(30);
        change_reason        : String(1000);
    }

    //재료비 프로젝트 BOM Mapping 수정
    action TcUpdateMcstBomProc(inputData : UpdateDataType) returns OutputData;

    type DeleteDataType : {
        tenant_id      : String(5);
        project_code   : String(30);
        model_code     : String(40);
        version_number : String(30);
        mapping_id     : Integer;
        user_id        : String(255);
    }

    //재료비 프로젝트 BOM Mapping 삭제
    action TcDeleteMcstBomProc(inputData : DeleteDataType) returns OutputData;

    type SavePartListData : {
        tenant_id              : String(5);
        project_code           : String(30);
        model_code             : String(40);
        version_number         : String(30);
        material_code          : String(40);
        commodity_code         : String(100);
        uom_code               : String(3);
        material_reqm_quantity : Decimal;
        buyer_empno            : String(30);
        mapping_id             : Integer;
        crud_type_code         : String(1);
    }

    type SavePartListDataType : {
        partList : array of SavePartListData;
        user_id : String(255);
    }

    //재료비 프로젝트 Part List(BOM) 저장
    action TcSaveMcstPartListProc(inputData : SavePartListDataType) returns OutputData;
}
