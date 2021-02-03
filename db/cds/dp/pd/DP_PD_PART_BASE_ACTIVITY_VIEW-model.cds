namespace dp;	
// using {dp as productActivityTemplate} from '../pd/DP_PD_PART_ACTIVITY_TEMPLATE-model';	
@cds.persistence.exists

entity Pd_Part_Base_Activity_View {
    key tenant_id             : String;
    key activity_code         : String;
        activity_name         : String;
        description           : String;
        sequence              : Decimal;
        active_flag           : Boolean;
        update_user_id        : String;
        local_update_dtm      : DateTime;
}
