using { cm as timeZoneMgt } from '../../../../db/cds/cm/CM_TIME_ZONE-model';
using { cm as DbSysdateMtzFunc } from '../../../../db/cds/cm/CM_DB_SYSDATE_MTZ_FUNC-model';
using { cm as GetdateFromDayofweekFunc } from '../../../../db/cds/cm/CM_GETDATE_FROM_DAYOFWEEK_FUNC-model';

namespace cm;

service TimeZoneMgtService {
    
    entity TimeZone as projection on timeZoneMgt.Time_Zone; 

    // v2 서비스 펑션 생성 버그 보류 v4 는 현재 가능

}
