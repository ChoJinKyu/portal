using { cm as dummyMgt } from '../../../../db/cds/cm/CM_DUMMY-model';
using { cm as copyMgt } from '../../../../db/cds/cm/CM_COPY-model';

namespace cm;

service DummyMgtService {

    entity Dummy as projection on dummyMgt.Dummy; 
    entity Copy as projection on copyMgt.Copy;

}