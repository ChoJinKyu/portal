namespace sp;

using util from '../../cm/util/util-model';

entity Np_Base_Price_Metal {
    key tenant_id       : String(5) not null  @title : '테넌트ID';
    key base_price_id   : Integer64 not null  @title : '기준단가ID';
        metal_type_code : String(30) not null @title : '메탈유형코드';
        metal_net_price : Decimal not null    @title : '메탈단가';
}

extend Np_Base_Price_Metal with util.Managed;
