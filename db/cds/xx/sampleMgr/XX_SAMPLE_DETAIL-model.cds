using {xx.Sample_Header as Header} from './XX_SAMPLE_HEADER-model';
namespace xx;

entity Sample_Detail {
  key detail_id : Integer64;
  header_id : Integer64;
  cd : String;
  name: String;
  local_create_dtm: DateTime;
  local_update_dtm: DateTime;
  create_user_id: String @cds.on.insert: $user;
  update_user_id: String @cds.on.insert: $user @cds.on.update: $user;
  system_create_dtm: DateTime @cds.on.insert: $now;
  system_update_dtm: DateTime @cds.on.insert: $now  @cds.on.update: $now;
}
