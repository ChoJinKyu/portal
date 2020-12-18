namespace cm;

using util from './util-model';

entity User_Role_Group {
    key tenant_id       : String(5) not null;
    key user_id         : String(50) not null;
    key role_group_code : String(30) not null;
        start_date      : Date not null;
        end_date        : Date not null;
}

extend User_Role_Group with util.Managed;
