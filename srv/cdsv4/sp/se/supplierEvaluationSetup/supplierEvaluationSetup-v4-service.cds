using { sp.Se_Copy_T as copyT } from '../../../../../db/cds/sp/se/SP_SE_COPY_T-model';
using { cm.Org_Code_Lng as maxLvl } from '../../../../../db/cds/cm/CM_ORG_CODE_LNG-model';

namespace sp;
@path : '/sp.supEvalSetupV4Service'
service SupEvalSetupV4Service { 
    
    /* Vendor Pool Level Chip Set */
    view VpLevelView as
        select Key lvl.tenant_id,
               Key lvl.org_code,
               Key lvl.code vp_operation_unit_code,
               Key cp.copy_no level_no,
               cp.copy_no || ' Level' level_name : String(10)
        from   maxLvl lvl,
               copyT cp
        where  to_number(lvl.code_name) >= cp.copy_no
        and    lvl.group_code = 'VP_VENDOR_POOL_MAX_LEVEL'
        and    lvl.language_cd = 'KO'
        ;

    view VpLevelChipView (tenant_id: String, org_code: String, op_unit_code: String) as
        select distinct 
               Key level_no,
               level_name
        from   VpLevelView
        where  tenant_id = :tenant_id
        and    org_code = :org_code
        and    instr(:op_unit_code, vp_operation_unit_code) > 0
        ;
}