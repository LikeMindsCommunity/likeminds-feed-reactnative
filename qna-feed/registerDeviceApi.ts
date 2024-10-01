export class RegisterDeviceRequest {
  // Properties of the request class
  token: string;
  deviceId: string;
  xPlatformCode: string;
}

export class InitiateUserRequest {
  // Properties of the request class
  is_guest: boolean;
  user_name: string;
  user_unique_id: string;
  api_key: string;
}

export async function validateRegisterDeviceRequest(
  request: RegisterDeviceRequest,
  accessToken: string,
) {
  const params = {
    token: request.token,
  };
  await fetch('https://auth.likeminds.community/user/device/push', {
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
}

export async function initiateAPI(request: InitiateUserRequest) {
  const params = {
    is_guest: false,
    user_name: request.user_name,
    user_unique_id: request.user_unique_id,
  };
  const response = await fetch(
    'https://auth.likeminds.community/sdk/initiate',
    {
      method: 'POST',
      headers: {
        'x-api-key': request.api_key,
      },
      body: JSON.stringify(params),
    },
  )
    .then(response => response.text())
    .then(result => {
      return JSON.parse(result);
    })
    .catch(error => console.error(error));

  return response;
}
