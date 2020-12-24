namespace cm;

using util from './util/util-model';

entity Pur_Org_Type_Map_View {

    key tenant_id         : String(5);
    key company_code      : String(10);
    key process_type_code : String(30);
        process_type_name : String(240);
        org_type_name     : String(240);
        use_flag          : Boolean;

}

extend Pur_Org_Type_Map_View with util.Managed;