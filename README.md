# LikeMinds Feed SDK for React Native

Drop-in social feed for React Native apps. Posts, comments, likes, polls and topics, running on both
bare React Native and Expo managed workflow.

[![npm](https://img.shields.io/npm/v/@likeminds.community/feed-rn-core.svg)](https://www.npmjs.com/package/@likeminds.community/feed-rn-core)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

**Docs:** https://docs.likeminds.io/

## What you get

Universal and personalised feeds · posts with text, images, video, documents, link previews, polls
and custom widgets · comments with nested replies · likes with liker lists · topics and
topic-filtered feeds · @-mentions · save, pin, hide, repost · search · activity feed · report queues ·
background upload with retry · push notifications.

Beyond the shared feature set: a **user-onboarding screen** for when no username is supplied, and
**anonymous post** support.

## Install

```bash
npm install @likeminds.community/feed-rn-core
```

This is the UI layer. It depends on the data layer:

```bash
npm install @likeminds.community/feed-rn
```

Source for the data layer is at
[likeminds-feed-reactnative-data](https://github.com/LikeMindsCommunity/likeminds-feed-reactnative-data).

### Optional peer dependencies

Media pickers are opt-in, and there are three generations to choose from: legacy pickers, React
Native 0.78+ pickers, and Expo pickers. Install the set matching your app so you are not carrying
the others.

## What is in this repo

| Directory | What it is |
|---|---|
| `likeminds-feed-reactnative-integration/` | The publishable package |
| `social-feed/` | Bare React Native CLI social feed |
| `social-feed-expo/` | The same feed in **Expo managed workflow**, using expo-router and Expo pickers |
| `qna-feed/` | Q&A variant with a custom post renderer |

## Expo

Expo is supported as a first-class target, not a port. `social-feed-expo` is a working expo-router
app, and the package ships compatibility shims so both bare-RN and Expo picker generations work
against the same API.

## Requirements

React Native 0.71 or later.

## Contributing

See the org-wide [contributing guide](https://github.com/LikeMindsCommunity/.github/blob/main/.github/CONTRIBUTING.md).
Security issues go to **natesh@likeminds.community**, not the issue tracker.

## License

Apache 2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
