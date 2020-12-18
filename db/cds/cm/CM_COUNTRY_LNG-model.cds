namespace cm;

using util from './util-model';

entity Country_Lng {
    key tenant_id     : String(5) not null;
    key country_code  : String(30) not null;
    key language_code : String(30) not null;
        country_name  : String(30) not null;
        description   : String(300);
}

extend Country_Lng with util.Managed;
