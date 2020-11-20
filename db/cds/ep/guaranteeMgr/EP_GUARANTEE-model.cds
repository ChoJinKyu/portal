namespace ep;

using util from '../../util/util-model';

entity Guarantee {
    key tenant_id                 : String(5) not null;
    key company_code              : String(10) not null;
    key contract_number           : String(50) not null;
    key contract_degree           : Integer64 not null;
    key gurantee_separated_code   : String(30) not null;
    key gurantee_sequence         : Decimal not null;
        gurantee_status_code      : String(30);
        gurantee_agency_code      : String(30);
        gurantee_insuarnce_amount : Decimal;
        gurantee_rate             : Decimal;
        gurantee_start_date       : Date;
        gurantee_end_date         : Date;
        gurantee_bond_number      : String(50);
        attch_group_number        : String(100);
        submit_date               : Date;
        offline_flag              : Boolean;
        reject_reason             : String(3000);
        org_type_code             : String(2);
        org_code                  : String(10);
        remark                    : String(3000);
}

extend Guarantee with util.Managed;
