namespace cm;
using { User } from '@sap/cds/common';
using util from '../../util/util-model';


entity Org_Plant {
    key tenant_id       : String(5)     not null @title: '테넌트ID';
    key company_code    : String(10)    not null @title: '회사코드';
    key plant_code      : String(10)    not null @title: '플랜트코드';
    plant_name          : String(240)   not null @title: '플랜트명';
    use_flag            : Boolean       not null @title: '사용여부';
    purchase_org_code   : String(10)             @title: '구매조직코드';
    bizdivision_code    : String(10)             @title: '사업부코드';
    au_code             : String(10)             @title: 'AU_CODE';
    hq_au_code          : String(10)             @title: 'HQ_AU_CODE'; 
}

extend Org_Plant with util.Managed;