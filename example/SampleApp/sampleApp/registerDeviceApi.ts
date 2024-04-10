import {
  CREATE_POST,
  POST_DETAIL,
  UNIVERSAL_FEED,
} from '@likeminds.community/feed-rn-core';
import {StackActionType} from '@react-navigation/native';
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {Platform} from 'react-native';
import {NAVIGATED_FROM_NOTIFICATION} from '@likeminds.community/feed-rn-core/constants/Strings';

const beta = `https://betaauth.likeminds.community`;
const prod = `https://auth.likeminds.community`;

class RegisterDeviceRequestBuilder {
  private token: string | undefined;
  private deviceId: string | undefined;
  // Add other properties as needed

  public setToken(token: string): RegisterDeviceRequestBuilder {
    this.token = token;
    return this;
  }

  public setDeviceId(deviceId: string): RegisterDeviceRequestBuilder {
    this.deviceId = deviceId;
    return this;
  }

  // Build method to create the final RegisterDeviceRequest object
  public build(): RegisterDeviceRequest {
    if (!this.token || !this.deviceId) {
      throw new Error('UUID and DeviceI are required.');
    }

    return new RegisterDeviceRequest(this.token, this.deviceId);
  }
}
export class RegisterDeviceRequest {
  // Properties of the request class
  token: string;
  deviceId: string;
  xPlatformCode: string;

  // Public constructor to create the request object
  constructor(token: string, deviceId: string) {
    this.token = token;
    this.deviceId = deviceId;
  }

  // Static builder method to create the request object
  public static builder(): RegisterDeviceRequestBuilder {
    return new RegisterDeviceRequestBuilder();
  }
}

export async function validateRegisterDeviceRequest(
  request: RegisterDeviceRequest,
  accessToken: string,
) {
  const params = {
    token: request.token,
  };
  await fetch('https://betaauth.likeminds.community/user/device/push', {
    method: 'POST',
    headers: {
      'x-device-id': request.deviceId,
      'x-platform-code': request.xPlatformCode,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(params),
  })
    .then(response => response.text())
    .then(result => {
      console.log(result);
      return true;
    })
    .catch(error => console.error(error));
  //  this.networkLibrary
  //   .makeAuthenticatedRequest(`/user/device/push`, {
  //     method: "POST",
  //     data: params,
  //     headers: {
  //       'x-device-id': request.deviceId,
  //       'x-platform-code': request.xPlatformCode,
  //   },
  //   })
  //   .then((resData: any) => {
  //     // Handle the response and return the LMResponse object
  //     const responseData: any = ModelConverter.responseBodyParser(
  //       resData.data,
  //     );

  //     return new LMResponse<any>(responseData, null, true);
  //   })
  //   .catch((error) => {
  //     return new LMResponse<any>(
  //       null,
  //       error.message || "An error occurred",
  //       false,
  //     );
  //   });
}



