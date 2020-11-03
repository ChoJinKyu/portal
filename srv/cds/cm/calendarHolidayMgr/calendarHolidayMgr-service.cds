
using cm.Calendar_Holiday from '../../../../db/cds/cm/calendarHolidayMgr/CM_CALENDAR_HOLIDAY-model';

namespace cm;
@path : '/cm.CalendarHolidayService'
service CalendarHolidayMgrService {

    entity Calendar_Holiday as projection on cm.Calendar_Holiday;

}
