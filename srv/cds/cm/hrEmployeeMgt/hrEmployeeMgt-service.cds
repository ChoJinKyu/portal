using { cm as hrEmployeeMgt } from '../../../../db/cds/cm/CM_HR_EMPLOYEE-model';

namespace cm;

service HrEmployeeMgtService {

    entity HrEmployee as projection on hrEmployeeMgt.Hr_Employee; 

}