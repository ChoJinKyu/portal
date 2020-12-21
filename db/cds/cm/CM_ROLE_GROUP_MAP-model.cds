namespace cm;

using util from './util/util-model';

entity Role_Group_Map {
    key tenant_id       : String(5) not null;
    key role_group_code : String(30);
    key role_code : String(30) not null;
}


extend Role_Group_Map with util.Managed;
