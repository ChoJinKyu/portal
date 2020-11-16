namespace cm;

@cds.persistence.exists
entity Db_Sysdate_Mtz_Func(p_tenant_id: String(5), p_sysdate: Date, p_from_time_zone: String(5), p_to_time_zone: String(5))
{
    
    key d_return: DateTime;

}