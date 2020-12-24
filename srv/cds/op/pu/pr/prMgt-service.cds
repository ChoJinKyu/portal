namespace op;

using {op.Pu_Pr_Mst as prMst} from '../../../../../db/cds/op/pu/pr/OP_PU_PR_MST-model';
using {op.Pu_Pr_Template_Map as prTMst} from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_MST-model';
using {op.Pu_Pr_Template_Map as prTMap} from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_MAP-model';
using {op.Pu_Pr_Template_Lng as prTLng} from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_LNG-model';
using {cm.Code_Lng as cdLng} from '../../../../../db/cds/cm/CM_CODE_LNG-model';


@path : '/op.pu.PrMgtService'
service PrMgtService {
    entity Pr_Mst as projection on op.Pu_Pr_Mst ;    
    entity Pr_Dtl as projection on op.Pu_Pr_Dtl;    
    entity Pr_Account as projection on op.Pu_Pr_Account;    
    entity Pr_Service as projection on op.Pu_Pr_Service;  

    // view Pr_MstView as
    //     select 
    //         key tenant_id,				//: String(5)      not null	 @title: '테넌트id';
    //         key company_code,			//: String(10)     not null	 @title: '회사코드';
    //         key pr_number	,			//: String(50)     not null	 @title: '구매요청번호';    
    //             pr_type_code   ,         //: String(30)    not null    @title: '구매요청유형코드' ;	
    //             pr_type_code_2 ,         //: String(30)    not null    @title: '구매요청품목그룹코드 ' ;	
    //             pr_type_code_3  ,        //: String(30)    not null    @title: '구매요청품목코드 ' ;	
    //             pr_template_number ,     //: String(10)    not null    @title: '구매요청템플릿번호' ;	
    //             requestor_empno         //: String(30)                @title: '요청자사번' ;	
    //             requestor_name  ,        //: String(50)                @title: '요청자명' ;	
    //             requestor_department_code   //: String(50)              @title: '요청자부서코드' ;	
    //             requestor_department_name, //: String(240)             @title: '요청자부서명' ;	
    //             request_date    ,        //: Date                      @title: '요청일자' ;	
    //             pr_create_status_code,  //: String(30)                @title: '구매요청생성상태코드' ;	
    //             pr_header_text    ,      //: String(200)               @title: '구매요청헤더텍스트' ;
                
    //         ( select code_name From cdLng 
    //             where   mst.tenant_id = cdLng.tenant_id 
    //                 and cdLng.group_code = 'OP_PR_TYPE_CODE' 
    //                 and cdLng.language_cd = 'KO' 
    //                 and mst.pr_type_code = cdLng.code ) as pr_type_name ,

    //         ( select code_name From cdLng 
    //             where   mst.tenant_id = cdLng.tenant_id 
    //                 and cdLng.group_code = 'OP_PR_TYPE_CODE_2' 
    //                 and cdLng.language_cd = 'KO' 
    //                 and mst.pr_type_code_2 = cdLng.code ) as pr_type_name_2,

    //         ( select code_name From cdLng 
    //             where   mst.tenant_id = cdLng.tenant_id 
    //                 and cdLng.group_code = 'OP_PR_TYPE_CODE_3' 
    //                 and cdLng.language_cd = 'KO' 
    //                 and mst.pr_type_code_3 = cdLng.code ) as pr_type_name_3,

    //         ( select pr_template_name From prTLng 
    //             where mst.tenant_id = prTLng.tenant_id 
    //                 and prTLng.language_code = 'KO' 
    //                 and mst.pr_template_number = prTLng.pr_template_number ) as pr_template_name

    //     from Pr_Mst mst ;






    entity Pr_TMst as projection on op.Pu_Pr_Template_Mst;  
    entity Pr_TDtl as projection on op.Pu_Pr_Template_Dtl;  
    entity Pr_TLng as projection on op.Pu_Pr_Template_Lng;  
    entity Pr_TMap as projection on op.Pu_Pr_Template_Map;  
   

   // 간단한 View 생성
    view Pr_TMapView as
    select 
        key map.tenant_id,
        key map.pr_type_code,
        key map.pr_type_code_2,
        key map.pr_type_code_3,
        key map.pr_template_number,
            ( select code_name From cdLng 
                where   map.tenant_id = cdLng.tenant_id 
                    and cdLng.group_code = 'OP_PR_TYPE_CODE' 
                    and cdLng.language_cd = 'KO' 
                    and map.pr_type_code = cdLng.code ) as pr_type_name : String,

            ( select code_name From cdLng 
                where   map.tenant_id = cdLng.tenant_id 
                    and cdLng.group_code = 'OP_PR_TYPE_CODE_2' 
                    and cdLng.language_cd = 'KO' 
                    and map.pr_type_code_2 = cdLng.code ) as pr_type_name_2 : String,

            ( select code_name From cdLng 
                where   map.tenant_id = cdLng.tenant_id 
                    and cdLng.group_code = 'OP_PR_TYPE_CODE_3' 
                    and cdLng.language_cd = 'KO' 
                    and map.pr_type_code_3 = cdLng.code ) as pr_type_name_3 : String,

            ( select pr_template_name From prTLng 
                where map.tenant_id = prTLng.tenant_id 
                    and prTLng.language_code = 'KO' 
                    and map.pr_template_number = prTLng.pr_template_number ) as pr_template_name : String
          
    from prTMap as map   ;
}