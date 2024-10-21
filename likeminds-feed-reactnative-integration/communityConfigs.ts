import { GetCommunityConfigurationsResponse } from "@likeminds.community/feed-rn";

interface JSONObject {
  [key: string]: any;
}
declare enum ConfigurationType {
  MEDIA_LIMITS = "media_limits",
  FEED_METADATA = "feed_metadata",
  PROFILE_METADATA = "profile_metadata",
  NSFW_FILTERING = "nsfw_filtering",
  WIDGETS_METADATA = "widgets_metadata",
  GUEST_FLOW_METADATA = "guest_flow_metadata"
}
export interface Configuration {
  description: string;
  type: ConfigurationType;
  value: JSONObject;
}
interface getCommunityConfigurationResponse {
  communityConfigurations: Configuration[]
}

export class CommunityConfigs {
  private static communityConfig: Configuration[];

  static setCommunityConfigs(
    communityConfig: Configuration[]
  ): void {
    CommunityConfigs.communityConfig = communityConfig;
  }

  static get communityConfigs(): Configuration[] {
    return CommunityConfigs.communityConfig;
  }
}
