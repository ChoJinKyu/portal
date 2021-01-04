using { dp as pdOperationOrg } from '../../../../../db/cds/dp/pd/DP_PD_OPERATION_ORG_VIEW-model';
using { dp as prodActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PRODUCT_ACTIVITY_TEMPLATE-model';
using { dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';
//using { dp as prodActivityTemplateType} from '../../../../../db/cds/dp/pd/DP_PD_PRODUCT_ACTIVITY_TEMPLATE_TYPE-model';

namespace dp;
@path : '/dp.ProductActivityV4Service'

service ProductActivityV4Service {
    entity PdOperationOrg as projection on pdOperationOrg.Pd_Operation_Org_View;
    entity PdProdActivityTemplate as projection on prodActivityTemplate.Pd_Product_Activity_Template;
    entity ActivityMapping as projection on activityMapping.Pd_Activity_Mapping;
//    entity PdProdActivityTemplateType as projection on prodActivityTemplateType.Pd_Product_Activity_Template_Type;

    type PdProdActivityTemplateType : {
        tenant_id : String(5)  not null @title: '테넌트ID' ;	
        company_code : String(10) default '*' not null @title: '회사코드' ;	
        org_type_code : String(2)  not null @title: '조직유형코드' ;	
        org_code : String(10)  not null @title: '조직코드' ;
        product_activity_code : String(40)  not null @title: '제품활동코드' ;	
        develope_event_code : String(30)   @title: '이벤트' ;	
        sequence : Decimal default 1  @title: '순번' ;	
        product_activity_name : String(240)   @title: '제품활동명' ;	
        product_activity_english_name : String(240)   @title: '제품활동영문명' ;	
        milestone_flag : Boolean   @title: '마일스톤여부' ;	
        active_flag : Boolean   @title: '활성여부' ;
        update_user_id : String(255) @title: '최종수정자';
        system_update_dtm : DateTime @title: '최종수정일시';    
        crud_type_code : String(1)     @title: 'CRUD유형';
        update_product_activity_code : String(40)  not null @title: '변경후 제품활동코드' ;	
    }

    type PdProdActivityTemplateTypeArray : {
        pdProdActivityTemplateType : array of PdProdActivityTemplateType;
    }

    type OutType : {
        return_code : String(2);
        return_msg  : String(5000);
    };
    action PdProductActivitySaveProc(inputData : PdProdActivityTemplateTypeArray) returns array of OutType;

}
