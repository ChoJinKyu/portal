using {xx.Sample_Detail as Detail} from './XX_SAMPLE_DETAIL-model';
namespace xx;

entity Sample_Header {
  key header_id : Integer64;
  cd : String;
  name: String;
  details: Association to many Detail on details.header_id = header_id;
  local_create_dtm: DateTime;
  local_update_dtm: DateTime;
  create_user_id: String @cds.on.insert: $user;
  update_user_id: String @cds.on.insert: $user @cds.on.update: $user;
  system_create_dtm: DateTime @cds.on.insert: $now;
  system_update_dtm: DateTime @cds.on.insert: $now  @cds.on.update: $now;
}