namespace op;


using {op.Pu_Pr_Template_Mst as prTMst}         from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_MST-model';
using {op.Pu_Pr_Template_Dtl as prTDtl}         from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_DTL-model';
using {op.Pu_Pr_Template_Map as prTMap}         from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_MAP-model';
using {op.Pu_Pr_Template_Lng as prTLng}         from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_LNG-model';
using {op.Pu_Pr_Template_Ett as prTEtt}         from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_ETT-model';
using {op.Pu_Pr_Template_Txn as prTXtn}         from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_TXN-model';
using {op.Pu_Pr_Template_DtlView as prTDtlView} from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_DTLVIEW-model';  

 using {cm.Code_Lng as cdLng}                   from '../../../../../db/cds/cm/CM_CODE_LNG-model';


@path : '/op.mst.TemplateService'
service TemplateService {

    entity Pr_TMst as projection on op.Pu_Pr_Template_Mst;
    entity Pr_TDtl as projection on op.Pu_Pr_Template_Dtl;
    entity Pr_TMap as projection on op.Pu_Pr_Template_Map;
    entity Pr_TLng as projection on op.Pu_Pr_Template_Lng;
    entity Pr_TEtt as projection on op.Pu_Pr_Template_Ett;
    entity Pr_TXtn as projection on op.Pu_Pr_Template_Txn;

    entity Pr_TDtlVIew as projection on op.Pu_Pr_Template_DtlView;

   

    
    // 간단한 View 생성
    view Pr_TMapView as
        select
            key map.tenant_id,
            key map.pr_type_code,
            key map.pr_type_code_2,
            key map.pr_type_code_3,
            key map.pr_template_number,
                (
                    select code_name from cdLng
                    where
                            map.tenant_id     = cdLng.tenant_id
                        and cdLng.group_code  = 'OP_PR_TYPE_CODE'
                        and cdLng.language_cd = 'KO'
                        and map.pr_type_code  = cdLng.code
                ) as pr_type_name     : String(30),

                (
                    select code_name from cdLng
                    where
                            map.tenant_id      = cdLng.tenant_id
                        and cdLng.group_code   = 'OP_PR_TYPE_CODE_2'
                        and cdLng.language_cd  = 'KO'
                        and map.pr_type_code_2 = cdLng.code
                ) as pr_type_name_2   : String(30),

                (
                    select code_name from cdLng
                    where
                            map.tenant_id      = cdLng.tenant_id
                        and cdLng.group_code   = 'OP_PR_TYPE_CODE_3'
                        and cdLng.language_cd  = 'KO'
                        and map.pr_type_code_3 = cdLng.code
                ) as pr_type_name_3   : String(30),

                (
                    select pr_template_name from prTLng
                    where
                            map.tenant_id          = prTLng.tenant_id
                        and prTLng.language_code   = 'KO'
                        and map.pr_template_number = prTLng.pr_template_number
                ) as pr_template_name : String(30)
                 ,

                OP_PU_PR_TEMPLATE_NUMBERS_FUNC( map.tenant_id, map.pr_template_number ) as  pr_template_numbers1: String(1000)


        from prTMap as map;
   
}
