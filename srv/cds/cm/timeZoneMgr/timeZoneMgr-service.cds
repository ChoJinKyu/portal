using { cm as timeZoneMgr } from '../../../../db/cds/cm/timeZoneMgr/CM_TIME_ZONE-model';
using { cm as DbSysdateMtzFunc } from '../../../../db/cds/cm/timeZoneMgr/CM_DB_SYSDATE_MTZ_FUNC-model';
using { cm as GetdateFromDayofweekFunc } from '../../../../db/cds/cm/timeZoneMgr/CM_GETDATE_FROM_DAYOFWEEK_FUNC-model';


// using {xx as Master} from '../../../db/cds/xx/sampleMstMgr/XX_SAMPLE_MASTER-model';
// using {xx as MasterF} from '../../../db/cds/xx/sampleMstMgr/XX_SAMPLE_MASTER_FUNC-model';
// using {xx as MasterP} from '../../../db/cds/xx/sampleMstMgr/XX_SAMPLE_MASTER_PROC-model';

namespace cm;

service TimeZoneMgrService {
    
    entity TimeZone as projection on timeZoneMgr.Time_Zone; 

    entity TimeZoneFunc(p_tenant_id: String(5),
                    p_sysdate: Date, 
                    p_from_time_zone: String(5), 
                    p_to_time_zone: String(5)) 
            as select from DbSysdateMtzFunc.Db_Sysdate_Mtz_Func(p_tenant_id: :p_tenant_id,
                                                                p_sysdate: :p_sysdate,
                                                                p_from_time_zone: :p_from_time_zone,
                                                                p_to_time_zone: :p_to_time_zone );

}