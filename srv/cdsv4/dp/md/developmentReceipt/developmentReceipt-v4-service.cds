using { dp as moldMst } from '../../../../../db/cds/dp/md/DP_MD_MST-model';
using { dp as moldSpec } from '../../../../../db/cds/dp/md/DP_MD_SPEC-model';

namespace dp;
@path : '/dp.DevelopmentReceiptV4Service'
service DevelopmentReceiptV4Service {

   type SavedMolds : {
        chk                         : Boolean;
        tenant_id                   : String;
        company_code                : String;
        org_code                    : String;
        mold_number                 : String;
        mold_sequence               : String;
        mold_id                     : String;
        mold_progress_status_code   : String;
        mold_production_type_code   : String;
        mold_item_type_code         : String;
        mold_type_code              : String;
        mold_location_type_code     : String;
        mold_cost_analysis_type_code: String;
        mold_purchasing_type_code   : String;
        die_form                    : String;
        mold_size                   : String;
        mold_developer_empno        : String;
        remark                      : String;
        family_part_number_1        : String;
        family_part_number_2        : String;
        family_part_number_3        : String;
        family_part_number_4        : String;
        family_part_number_5        : String;
        set_id                      : String;
    };

    type resultMsg {
        messageCode : String;
        resultCode : Integer;
    }

    action BindDevelopmentReceipt (moldDatas : array of SavedMolds) returns resultMsg;
    
    action CancelBindDevelopmentReceipt (moldDatas : array of SavedMolds) returns resultMsg;

}
