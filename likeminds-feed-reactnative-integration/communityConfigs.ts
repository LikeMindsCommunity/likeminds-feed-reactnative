import { GetCommunityConfigurationsResponse } from "@likeminds.community/feed-js/dist/initiateUser/model/GetCommunityConfigurationsResponse";

export class CommunityConfigs {
  private static communityConfig: GetCommunityConfigurationsResponse;

  static setCommunityConfigs(
    communityConfig: GetCommunityConfigurationsResponse
  ): void {
    CommunityConfigs.communityConfig = communityConfig;
  }

  static get communityConfigs(): GetCommunityConfigurationsResponse {
    return CommunityConfigs.communityConfig;
  }
}
