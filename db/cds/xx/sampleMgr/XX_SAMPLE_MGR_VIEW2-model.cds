using {xx.Sample_Detail as Detail} from './XX_SAMPLE_DETAIL-model';
using {xx.Sample_Header as Header} from './XX_SAMPLE_HEADER-model';
namespace xx;

view Sample_Mgr_View2 as 
    select key h.header_id
          ,h.cd as header_cd
          ,h.name as header_name
          ,key d.detail_id
          ,d.cd as detail_cd
          ,d.name as detail_name
    from Header as h 
    left join Detail as d on h.header_id = d.header_id
;