namespace xx;

using util from '../../cm/util/util-model';
using from './XX_COMPANY-model';

entity Plant {
    key tenant_id           : String(5) not null   @title : '테넌트ID';
    key company_code        : String(10) not null  @title : '회사코드';
    key plant_code          : String(10) not null  @title : '플랜트코드';
        plant_name          : String(240) not null @title : '플랜트명';
        use_flag            : Boolean not null     @title : '사용여부';
        purchase_org_name   : String(240)          @title : '구매조직';
        bizdivision_name    : String(240)          @title : '사업부';
        au_name             : String(240)          @title : 'AU';
        hq_au_name          : String(240)          @title : 'HQ_AU';
        master_org_flag     : Boolean not null     @title : '마스터조직여부';
        validation_org_flag : Boolean not null     @title : '밸리데이션조직여부';

        parent              : Association to xx.Company
                                on  parent.tenant_id  = tenant_id
                                and parent.company_code = company_code;

}

extend Plant with util.Managed;
