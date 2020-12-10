using {xx.Sample_Header as Header} from './XX_SAMPLE_HEADER-model';
namespace xx;

entity Sample_Detail {
  key detail_id : Integer64 not null;
  header_id : Integer64;
  cd : String;
  name: String;
}
