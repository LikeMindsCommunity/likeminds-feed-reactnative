import { Configuration } from "../communityConfigs";
import { WordAction } from "../enums/Variables";
import pluralizeOrCapitalize from "../utils/variables";

// post attachment types
export const IMAGE_ATTACHMENT_TYPE = 1;
export const VIDEO_ATTACHMENT_TYPE = 2;
export const DOCUMENT_ATTACHMENT_TYPE = 3;
export const LINK_ATTACHMENT_TYPE = 4;
export const POLL_ATTACHMENT_TYPE = 6;

// post menu items id
export const DELETE_POST_MENU_ITEM = 1;
export const PIN_POST_MENU_ITEM = 2;
export const UNPIN_POST_MENU_ITEM = 3;
export const REPORT_POST_MENU_ITEM = 4;
export const EDIT_POST_MENU_ITEM = 5;
export const DELETE_COMMENT_MENU_ITEM = 6;
export const REPORT_COMMENT_MENU_ITEM = 7;
export const EDIT_COMMENT_MENU_ITEM = 8;
export const HIDE_POST_MENU_ITEM = 12;
export const UNHIDE_POST_MENU_ITEM = 13;

// report entity types
export const POST_REPORT_ENTITY_TYPE = 5;
export const COMMENT_REPORT_ENTITY_TYPE = 6;
export const REPLY_REPORT_ENTITY_TYPE = 7;

// post/comment/reply type
export const POST_TYPE = "post";
export const COMMENT_TYPE = "comment";
export const REPLY_TYPE = "reply";

// toast messages
export let REPORTED_SUCCESSFULLY = "Post Reported!";
export let COMMENT_REPORTED_SUCCESSFULLY = "Comment Reported!";
export const SOMETHING_WENT_WRONG = "Something Went Wrong";
export let REASON_FOR_REPORTING_PLACEHOLDER =
  "Enter the reason for reporting this post";
export let REASON_FOR_DELETION_PLACEHOLDER =
  "Enter the reason for deleting this post";
export let ENTER_REASON_FOR_DELETION =
  "Please enter a specific reason for deleting this post";
// pin option in menu items
export let PIN_THIS_POST = "Pin this Post";
export let UNPIN_THIS_POST = "Unpin this Post";
export let POST_HIDDEN = "Post is hidden";
export let POST_UNHIDDEN = "Post is visible";
export const PIN_POST_ID = 2;
export const UNPIN_POST_ID = 3;

// fetch tags type
export const DELETE_TAGS_TYPE = 0;
export const REPORT_TAGS_TYPE = 3;

// delete and report modal's text message
export const CONFIRM_DELETE = (type: string) =>
  `Are you sure you want to delete this ${type}. This action cannot be reversed.`;
export const REPORT_INSTRUSTION = (type: string) =>
  `You would be able to report this ${type} after selecting a problem`;
export const REPORT_PROBLEM = "Please specify the problem to continue";
export const DELETION_REASON = "Reason for deletion";

// app name
export const APP_TITLE = "LikeMinds Sample App";

// uploading post processing text
export const POST_UPLOADING = "Posting";
export const POST_UPLOAD_RETRY = "Upload failed";

// selection types of media
export const SELECT_IMAGE = "photo";
export const SELECT_BOTH = "mixed";
export const SELECT_VIDEO = "video";
export const SELECT_FILE = "file";

// create post screen's text
export const ADD_FILES = "Attach Files";
export const ADD_IMAGES = "Add Photo";
export const ADD_POLL = "Add Poll";
export const ADD_VIDEOS = "Add Video";
export const SOCIAL_FEED_CREATE_POST_PLACEHOLDER_TEXT =
  "Write something here...";
export const QnA_FEED_CREATE_POST_PLACEHOLDER_TEXT = "Add description";
export const QnA_FEED_CREATE_POST_HEADING_PLACEHOLDER_TEXT =
  "Add your question here *";
export const ADD_MORE_MEDIA = "Add More";
export const ADD_POST_TEXT = "CREATE";
export const SAVE_POST_TEXT = "SAVE";

// android storage permession's text
export const STORAGE_PERMISSION = "Storage Permission";
export const STORAGE_PERMISSION_MESSAGE =
  "App needs permission to access your storage";
export const STORAGE_PERMISSION_ALERT_HEADING = "Storage Permission Required";
export const STORAGE_PERMISSION_ALERT_DESCRIPTION =
  "App needs access to your storage to read files. Please go to app settings and grant permission.";

// toast messages
export let POST_DELETE = "Post Deleted!";
export let COMMENT_DELETE = "Comment Deleted!";
export const REPORT_REASON_VALIDATION = "Please enter a reason";
export let POST_UPLOADED = "Your post was shared";
export let POST_UPLOADED_ANONYMOUSLY = "Your post was shared anonymously"
export let POST_PIN_SUCCESS = "Post pinned to top!";
export let POST_UNPIN_SUCCESS = "Post unpinned!";
export let POST_UPLOAD_INPROGRESS = "A post is already uploading!";
export let CREATE_POST_PERMISSION =
  "You do not have permission to create a post.";
export const FILE_UPLOAD_SIZE_VALIDATION =
  "Files below 100 KB and above 100MB are not allowed";
export const FILE_UPLOAD_IMAGE_SIZE_VALIDATION = "Max file size allowed: <x>Mb";
export const FILE_UPLOAD_VIDEO_SIZE_VALIDATION = "Max file size allowed: <x>Mb";
export const MEDIA_UPLOAD_COUNT_VALIDATION = "You can select upto 10 items!";
export let POST_SAVED_SUCCESS = "Post saved!";
export let POST_UNSAVED_SUCCESS = "Post unsaved!";

export let POST_LIKES = "Post likes";
export let COMMENT_LIKES = "Comment likes";
export const DELETE_REASON_SELECTION = "Please select a reason for deletion";

export const IMAGE_TEXT = "image";
export const PHOTO_TEXT = "photo";
export const PHOTOS_TEXT = "photos";
export const VIDEOS_TEXT = "videos";
export const VIDEO_TEXT = "video";

// file size validation
export const MAX_FILE_SIZE = 104857600; // 100MB in bytes
export const MIN_FILE_SIZE = 100000; // 100KB in bytes
export const MAX_IMAGE_FILE_SIZE = 5242880;
export const MAX_VIDEO_FILE_SIZE = 104857600;

export const NAVIGATED_FROM_POST = "FROM_POST";
export const NAVIGATED_FROM_COMMENT = "FROM_COMMENTS";
export const NAVIGATED_FROM_NOTIFICATION = "FROM_NOTIFICATION";

// member state
export const STATE_ADMIN = 1;
export const STATE_MEMBER = 4;
export const RIGHT_CREATE_POST = 9;

// post detail screen text
export const VIEW_MORE_TEXT = "View more replies";

// error message for icon path type
export const ICON_PATH_VALIDATION_ERROR =
  "Property iconUrl and assetPath can not exist together.";

// error messages
export const MEDIA_FETCH_ERROR = "An error occured while fetching the media";

// min document count to display
export const MIN_DOCUMENT_ITEM = 2;

// default maximum number of lines to be visible of the post content
export const MAX_DEFAULT_POST_CONTENT_LINES = 3;
// default maximum number of lines to be visible in post comments
export const MAX_DEFAULT_COMMENT_LINES = 3;

// comment levels
export const PARENT_LEVEL_COMMENT = 0;
export const CHILD_LEVEL_COMMENT = 1;

// poll
export const DATE_TEXT = "date";
export const TIME_TEXT = "time";
export const DATE_TIME_TEXT = "datetime";
export const POLL_RESULT_TEXT = "Poll Results";
export const QUESTION_WARNING = "Question Field cannot be empty";
export const EXPIRY_TIME_WARNING = "Please select expiry time";
export const FUTURE_TIME_WARNING = "Please select a time in the future.";
export const POLLS_OPTIONS_WARNING = "Poll options can't be the same";
export const POLLS_OPTIONS_LIMIT_WARNING = "Poll options can't be more than 10";
export const EMPTY_OPTIONS_WARNING = "Empty options are not allowed";
export const PLACEHOLDER_VALUE = "Ask a question";
export const OPTION_TEXT = "Option";
export const DATE_PLACEHOLDER = "DD-MM-YYYY hh:mm";
export const ANONYMOUS_POLL_TEXT = "Anonymous Poll";
export const LIVE_RESULT_TEXT = "Don't show live results";
export const USER_CAN_VOTE_FOR = "User can vote for";
export const SELECT_OPTION = "Select option";
export const POST_TITLE = "POST";
export const ADD_OPTION_TEXT = "+ Add an option";
export const SUBMIT_VOTE_TITLE = "Submit Vote";
export const EDIT_POLL_TEXT = "Edit Vote";
export const ADD_NEW_POLL_OPTION = "Add new poll option";
export const NEW_POLL_OPTION_TEXT =
  "Enter an option that you think is missing in this poll. This can not be undone.";
export const SUBMIT_TEXT = "SUBMIT";
export const POLL_ENDED_WARNING = "Poll ended. Vote cannot be submitted now";
export const POLL_SUBMITTED_SUCCESSFULLY = "Your vote is submitted succesfully";
export const ANONYMOUS_POLL_TITLE = "Anonymous poll";
export const ANONYMOUS_POLL_SUB_TITLE =
  "This being an anonymous poll, the names of the voters can not be disclosed";
export const POLL_MULTIPLE_STATE_EXACTLY = 0;
export const POLL_MULTIPLE_STATE_MAX = 1;
export const POLL_MULTIPLE_STATE_LEAST = 2;
export const OKAY = "Okay";
export const NO_RESPONSES = "No Response";

// Events
export const KEYBOARD_DID_SHOW = "keyboardDidShow";
export const KEYBOARD_DID_HIDE = "keyboardDidHide";

export function updateVariables (communityConfig: Configuration[]) {
    const config = communityConfig.find((item) => item?.type == "feed_metadata")
    const POST = (config)?.value?.post ?? "post"
    const COMMENT = (config)?.value?.comment ?? "comment"
    const LIKE = (config)?.value?.likeEntityVariable?.entityName ?? "like"


    REPORTED_SUCCESSFULLY = `${pluralizeOrCapitalize(POST,WordAction.firstLetterCapitalSingular)} Reported!`;
    COMMENT_REPORTED_SUCCESSFULLY = `${pluralizeOrCapitalize(COMMENT,WordAction.firstLetterCapitalSingular)} Reported!`;
    REASON_FOR_REPORTING_PLACEHOLDER =
      `Enter the reason for reporting this ${pluralizeOrCapitalize(POST,WordAction.allSmallSingular)}`;
    REASON_FOR_DELETION_PLACEHOLDER =
      `Enter the reason for deleting this ${pluralizeOrCapitalize(POST,WordAction.allSmallSingular)}`;
    ENTER_REASON_FOR_DELETION =
      `Please enter a specific reason for deleting this ${pluralizeOrCapitalize(POST,WordAction.allSmallSingular)}`;
    PIN_THIS_POST = `Pin this ${pluralizeOrCapitalize(POST,WordAction.allSmallSingular)}`;
    UNPIN_THIS_POST = `Unpin this ${pluralizeOrCapitalize(POST,WordAction.allSmallSingular)}`;
    POST_HIDDEN = `${pluralizeOrCapitalize(POST,WordAction.firstLetterCapitalSingular)} is hidden`;
    POST_UNHIDDEN = `${pluralizeOrCapitalize(POST,WordAction.firstLetterCapitalSingular)} is visible`;
    POST_DELETE = `${pluralizeOrCapitalize(POST,WordAction.firstLetterCapitalSingular)} Deleted!`;
    COMMENT_DELETE = `${pluralizeOrCapitalize(COMMENT,WordAction.allSmallSingular)} Deleted!`;
    POST_UPLOADED = `Your ${pluralizeOrCapitalize(POST,WordAction.allSmallSingular)} was shared`;
    POST_UPLOADED_ANONYMOUSLY = `Your ${pluralizeOrCapitalize(POST,WordAction.allSmallSingular)} was shared anonymously`
    POST_PIN_SUCCESS = `${pluralizeOrCapitalize(POST,WordAction.firstLetterCapitalSingular)} pinned to top!`;
    POST_UNPIN_SUCCESS = `${pluralizeOrCapitalize(POST,WordAction.firstLetterCapitalSingular)} unpinned!`;
    POST_UPLOAD_INPROGRESS = `A ${pluralizeOrCapitalize(POST,WordAction.allSmallSingular)} is already uploading!`;
    CREATE_POST_PERMISSION =
      `You do not have permission to create a ${pluralizeOrCapitalize(POST,WordAction.allSmallSingular)}.`;
    POST_SAVED_SUCCESS = `${pluralizeOrCapitalize(POST,WordAction.firstLetterCapitalSingular)} saved!`;
    POST_UNSAVED_SUCCESS = `${pluralizeOrCapitalize(POST,WordAction.firstLetterCapitalSingular)} unsaved!`;
    POST_LIKES = `${pluralizeOrCapitalize(POST,WordAction.firstLetterCapitalSingular)} ${pluralizeOrCapitalize(LIKE,WordAction.allSmallPlural)}`;
    COMMENT_LIKES = `${pluralizeOrCapitalize(COMMENT,WordAction.firstLetterCapitalSingular)} ${pluralizeOrCapitalize(LIKE,WordAction.allSmallPlural)}`;
}
