import Realm from 'realm';

export class LoginSchemaRO extends Realm.Object<LoginSchemaRO> {
  id!: string;
  userUniqueID!: string;
  userName!: string;
  apiKey!: string;

  static schema = {
    name: 'LoginSchemaRO',
    properties: {
      id: 'string',
      userUniqueID: 'string',
      userName: 'string',
      apiKey: 'string',
    },
    primaryKey: 'id',
  };
}

export const getUserFromLocalDB = async () => {
  let realm;

  try {
    // Open the Realm with the User schema
    realm = await Realm.open({
      schema: [LoginSchemaRO],
    });

    // Fetch the user by userId
    const user = realm.objectForPrimaryKey('LoginSchemaRO', 'LoginSchema');

    console.log('user ==', user);

    // If user not found, return null
    if (!user) {
      return null;
    }

    // Map the Realm user object to LoginSchemaRO
    return;
  } catch (error) {
    console.error('Error fetching user from local DB:', error);
    throw error;
  } finally {
    // Close the Realm
    if (realm) {
      realm.close();
    }
  }
};
