namespace cm;

using util from './util-model';

entity Role_Group {
    key tenant_id       : String(5) not null;
    key role_group_code : String(30);
        role_group_name : String(300) not null;
        role_desc       : String(300) not null;
}


extend Role_Group with util.Managed;
