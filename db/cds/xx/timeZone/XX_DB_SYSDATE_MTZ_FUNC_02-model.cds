namespace xx;

using { User } from '@sap/cds/common';

@cds.persistence.exists
entity Db_Sysdate_Mtz_Func_02(p_tenant_id: String(5), p_sysdate: Date, p_from_time_zone: String(5), p_to_time_zone: String(5))
{
    
    key d_return: DateTime;

}