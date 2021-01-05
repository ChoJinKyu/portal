/************************************************
  1. namespace
  - 모듈코드 소문자로 작성
  - 소모듈 존재시 대모듈.소모듈 로 작성
  2. entity
  - 대문자로 작성
  - 테이블명 생성을 고려하여 '_' 추가
  3. 컬럼(속성)
  - 소문자로 작성
  4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시
  entity 위에 @cds.persistence.exists 명시  
  
  5. namespace : db
  6. service : MtlCommodityMgt
  7. service description : Commodity Service
  8. history
  -. 2020.12.11 : 최미희 최초작성
*************************************************/
using { dp as Commodity }    from  '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_COMMODITY-model';
using { dp as CommodityLng } from  '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_COMMODITY_LNG-model';
namespace dp;
@path : '/dp.MtlCommodityMgtService'

service MtlCommodityMgtService {

    entity MtlCommodity as projection on Commodity.Mm_Material_Commodity;
    entity MtlCommodityLng as projection on CommodityLng.Mm_Material_Commodity_Lng;

    view MtlCommodityView as
    select key m.tenant_id,
           key m.commodity_code,
           ifnull(l.commodity_name, m.commodity_name) as commodity_name : String(100),
           ifnull(l.commodity_desc, m.commodity_desc) as commodity_desc : String(1000),
           m.use_flag,
           l.language_code
    from  Commodity.Mm_Material_Commodity m
    left join CommodityLng.Mm_Material_Commodity_Lng l
    on l.tenant_id = m.tenant_id
      and l.commodity_code = m.commodity_code
      and l.language_code = 'KO'
    ;



}