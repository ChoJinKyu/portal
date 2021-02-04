//https://lgcommondev2-workspaces-ws-7bzzl-app1.jp10.applicationstudio.cloud.sap/odata/v4/dp.creationRequestV4Service/PdCreationRequestSaveProcCall
// using {dp as creationRequest} from '../../../../../db/cds/dp/pd/DP_PD_PART_CATEGORY_CREATION_REQUEST-model';
// using {dp as categoryApproval} from '../../../../../db/cds/dp/pd/DP_PD_PART_CATEGORY_APPROVAL-model';
// using {dp as partCategoryLng} from '../../../../../db/cds/dp/pd/DP_PD_PART_CATEGORY_LNG-model';
// using {dp as partCategory} from '../../../../../db/cds/dp/pd/DP_PD_PART_CATEGORY-model';	

namespace dp;
@path : '/dp.creationRequestV4Service'

service CreationRequestV4Service {

    type PdCategoryCreationRequetType : {
            tenant_id : String;
            request_number : String;
            category_group_code : String;
            approval_number : String;
            request_title : String;
            request_category_name : String;
            similar_category_code : String;
            requestor_empno : String;
            request_date_time : DateTime;
            request_desc : LargeString;
            attch_group_number : String;
            progress_status_code : String;
            creator_empno : String;
            create_category_code : String;
            update_user_id : String;
            crud_type_code : String;
    };

    type PdCategoryApprovalType : {
            tenant_id : String;
            request_number : String;
            approve_sequence : Decimal;
            approval_number : String;
            requestor_empno : String;
            tf_flag : Boolean;
            approval_comment : String;
            approve_date_time : DateTime;
            update_user_id : String;
            crud_type_code : String;
    };

    type OutType : {
        return_code : String(2);
        return_msg  : String(5000);
    };

    type ProcInputType : {
        crud_type  : String(1);
        pdMst      : PdCategoryCreationRequetType;
        pdDtl      : array of PdCategoryApprovalType;
    }

    action PdCreationRequestSaveProc(inputData : ProcInputType) returns OutType;

}