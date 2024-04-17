import React from "react";
import { Linking, StyleSheet, Text } from "react-native";

const REGEX_USER_SPLITTING = /(<<.+?\|route:\/\/[^>]+>>)/gu;
const REGEX_USER_TAGGING =
  /<<(?<name>[^<>|]+)\|route:\/\/(?<route>[^?]+(\?.+)?)>>/g;

// this function detect links in a string
function detectLinks(message: string, isLongPress?: boolean) {
  const regex =
    /((?:https?:\/\/)?(?:www\.)?(?:\w+\.)+\w+(?:\/\S*)?|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b)/i;

  const parts = message.split(regex);
  if (parts?.length > 0) {
    return (
      <Text>
        {parts?.map((val: string, index: number) => (
          <Text key={val + index}>
            {/* key should be unique so we are passing `val(abc) + index(number) = abc2` to make it unique */}
            {regex.test(val) ? (
              <Text
                onPress={async () => {
                  if (!isLongPress) {
                    const urlRegex = /(https?:\/\/[^\s]+)/gi;
                    const emailRegex =
                      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
                    const isURL = urlRegex.test(val);
                    const isEmail = emailRegex.test(val);

                    if (isEmail) {
                      await Linking.openURL(`mailto:${val}`);
                    } else if (isURL) {
                      await Linking.openURL(val);
                    } else {
                      await Linking.openURL(`https://${val}`);
                    }
                  }
                }}
              >
                <Text style={styles.mentionStyle}>{val}</Text>
              </Text>
            ) : (
              <Text>{val}</Text>
            )}
          </Text>
        ))}
      </Text>
    );
  } else {
    return message;
  }
}

// this function convert the route to mentioned username
const decode = (
  text: string | undefined,
  enableClick: boolean,
  isLongPress?: boolean
) => {
  if (!text) {
    return;
  }
  const arr: Array<{ key: string; route: string | null }> = [];
  const parts = text?.split(REGEX_USER_SPLITTING);

  if (parts) {
    for (const matchResult of parts) {
      if (matchResult.match(REGEX_USER_TAGGING)) {
        const match = REGEX_USER_TAGGING.exec(matchResult);
        if (match !== null) {
          if (match?.groups) {
            const { name, route }: any = match.groups || "";
            arr.push({ key: name, route: route });
          }
        }
      } else {
        arr.push({ key: matchResult, route: null });
      }
    }

    return enableClick ? (
      <Text>
        {arr.map((val, index) => (
          <Text key={val.key + index}>
            {/* key should be unique so we are passing `val(abc) + index(number) = abc2` to make it unique */}

            {val.route ? (
              <Text
                onPress={() => {
                  if (!isLongPress) {
                    // Alert.alert(`navigate to the route ${val?.route}`);
                  }
                }}
                style={styles.mentionStyle}
              >
                {`@${val.key}`}
              </Text>
            ) : (
              detectLinks(val.key, isLongPress)
            )}
          </Text>
        ))}
      </Text>
    ) : (
      <Text>
        {arr.map((val, index) => (
          <Text key={val.key + index}>
            {val.route ? (
              <Text style={styles.mentionStyle}>{val.key}</Text>
            ) : (
              val.key
            )}
          </Text>
        ))}
      </Text>
    );
  } else {
    return text;
  }
};

export const userTaggingDecoder = (text: string | undefined) => {
  if (!text) {
    return;
  }
  const arr: Array<{ key: string; route: string | null }> = [];
  const parts = text?.split(REGEX_USER_SPLITTING);

  if (parts) {
    for (const matchResult of parts) {
      if (matchResult.match(REGEX_USER_TAGGING)) {
        const match = REGEX_USER_TAGGING.exec(matchResult);
        if (match !== null) {
          if (match?.groups) {
            const { name, route }: any = match.groups || "";
            arr.push({ key: name, route: route });
          }
        }
      }
    }
  }

  return arr;
};

const styles = StyleSheet.create({
  mentionStyle: {
    color: "#007AFF",
  },
});
export default decode;
