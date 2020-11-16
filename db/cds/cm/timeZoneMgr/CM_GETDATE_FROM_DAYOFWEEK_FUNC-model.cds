namespace cm;

@cds.persistence.exists
entity Getdate_From_Dayofweek_Func(p_yyyy : Integer64, p_mm : Integer64, p_dd : Integer64, p_week_of_month : Integer64, p_day_of_week : Integer64)
{
    
    key d_return: String(10);

}