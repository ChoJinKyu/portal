using {dp as GetCmCode} from '../../../../../db/cds/dp/pd/DP_PD_GET_CM_CODE_COMBO_FUNC-model';

namespace dp;
@path : '/dp.GetCmCodeComboV4Service'
service GetCmCodeComboV4Service { 
    entity Pd_Get_Cm_Code_Combo_Func(tenant_id: String(5), language_cd: String(30), group_code: String(30)) as
        select from GetCmCode.Pd_Get_Cm_Code_Combo_Func(tenant_id: :tenant_id, language_cd: :language_cd, group_code: :group_code)
}