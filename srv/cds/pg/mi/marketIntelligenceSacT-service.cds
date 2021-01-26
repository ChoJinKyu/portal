//Table
using {pg.It_Mst_Exch_Rate as DailyExchRate} from '../../../../db/cds/pg/it/PG_IT_MST_EXCH_RATE-model';     // 일별환율 Mst
//View
using {pg as MiBom} from '../../../../db/cds/pg/mi/PG_MI_SAC_MI_BOM_MAPPING_VIEW-model';            //시황BOM Mapping
using {pg as MatBom} from '../../../../db/cds/pg/mi/PG_MI_SAC_MAT_BOM_MAPPING_VIEW-model';          //자재-시황자재 Mapping
using {pg as MiPrice} from '../../../../db/cds/pg/mi/PG_MI_SAC_LATEST_MI_PRICE_VIEW-model';         //시황자재별 최근 시황금액
using {pg as ReqmQty} from '../../../../db/cds/pg/mi/PG_MI_SAC_REQM_QUANTITY_VIEW-model';           //자재별 시황자재 소요량
using {pg as MaterialInfo} from '../../../../db/cds/pg/mi/PG_MI_SAC_MATERIAL_INFO_VIEW-model';      //자재별 정보
using {pg as ExchRate} from '../../../../db/cds/pg/mi/PG_MI_SAC_EXCH_RATE_VIEW-model';              //환율


namespace pg;

@path : '/pg.marketIntelligenceSacTService'
service marketIntelligenceSacTService {

    // Entity List
    // View List
    view MiSacMiBomMappingView @(title : '시황BOM Mapping View') as select from MiBom.Mi_Sac_Mi_Bom_Mapping_View;             //시황BOM Mapping
    view MiSacMatBomMappingView @(title : '자재-시황자재 Mapping View') as select from MatBom.Mi_Sac_Mat_Bom_Mapping_View;     //자재-시황자재 Mapping
    view MiSacLatestMiPriceView @(title : '시황자재별 최근 시황금액 View') as select from MiPrice.Mi_Sac_Latest_Mi_Price_View;  //시황자재별 최근 시황금액
    view MiSacReqmQuantityView @(title : '자재별 시황자재 소요량 View') as select from ReqmQty.Mi_Sac_Reqm_Quantity_View;       //자재별 시황자재 소요량
    view MiSacMaterialInfoView @(title : '자재별 정보 View') as select from MaterialInfo.Mi_Sac_Material_Info_View;            //자재별 정보
    view MiSacExchRateView @(title : '환율 View') as select from ExchRate.Mi_Sac_Exch_Rate_View;                               //환율

    view MiSacDailyExchRateView @(title : '일별환율 View') as 
    select
        key tenant_id
       ,key exrate_type_code
       ,key source_currency_code
       ,key target_currency_code
       ,key exrate_start_date
           ,'PG0101_00010'  as  mi_measure : String(20)
           ,exchange_rate
    from DailyExchRate
    ;



}