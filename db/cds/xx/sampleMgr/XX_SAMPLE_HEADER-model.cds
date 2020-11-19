using {xx.Sample_Detail as Detail} from './XX_SAMPLE_DETAIL-model';
namespace xx;

entity Sample_Header {
  key header_id : Integer64 not null;
  cd : String;
  name: String;
  details: Association to many Detail on details.header_id = header_id;
}