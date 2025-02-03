export const pollStyle = {
  pollQuestionStyles: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'green',
  },
  pollOptionSelectedColor: 'blue',
  pollOptionOtherColor: 'red',
  votesCountStyles: {
    fontSize: 16,
    color: 'green',
  },
  pollOptionSelectedTextStyles: {color: 'white'},
  pollOptionOtherTextStyles: {color: 'green'},
  pollOptionEmptyTextStyles: {color: 'blue'},
  pollOptionAddedByTextStyles: {color: 'pink'},
  memberVotedCountStyles: {
    fontSize: 16,
    color: 'red',
  },
  pollInfoStyles: {
    fontSize: 14,
    color: 'pink',
  },
  submitButtonStyles: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    width: 100,
  },
  submitButtonTextStyles: {
    fontSize: 12,
    color: 'white',
  },
  allowAddPollOptionButtonStyles: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  allowAddPollOptionButtonTextStyles: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  editPollOptionsStyles: {
    backgroundColor: 'yellow',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  // editPollOptionsIcon: 'require(./edit-icon.png)',
  clearPollOptionsStyles: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  // clearPollOptionsIcon: 'require(./clear-icon.png)',
};

export const createPollStyle = {
  pollQuestionsStyle: {
    fontSize: 16,
    color: 'black',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginBottom: 10,
  },
  pollOptionsStyle: {
    fontSize: 16,
    color: 'black',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginBottom: 10,
  },
  pollExpiryTimeStyle: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
  },
  pollAdvancedOptionTextStyle: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 10,
  },
  // pollAdvancedOptionExpandIcon: 'require(expand-icon.png)',
  // pollAdvancedOptionMinimiseIcon: 'require(minimise-icon.png)',
  pollAdvanceOptionsSwitchThumbColor: 'green',
  pollAdvanceOptionsSwitchTrackColor: 'lightgreen',
};

export const carouselScreenStyle = {
  headerTitle: {
    color: 'green',
  },
  headerSubtitle: {
    color: 'purple',
  },
  thumbTintColor: 'pink',
  minimumTrackTintColor: 'red',
  maximumTrackTintColor: 'blue',
  muteIconPath:
    'https://t4.ftcdn.net/jpg/07/68/25/99/240_F_768259926_Nd2TLAzX1MMDAeQUTypLjvuD3opDeLmt.jpg',
  isMuteIconLocalPath: false,
  muteIconStyle: {
    tintColor: null,
  },
  unmuteIconStyle: {
    tintColor: 'red',
  },
};

export const customFeedStyles = {
  newPostButtonStyle: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  newPostButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Arial',
  },
  newPostIcon: {
    uri: 'https://example.com/icon.png',
    style: {
      width: 24,
      height: 24,
    },
  },
  screenHeader: {
    titleStyle: {
      color: '#333333',
      fontSize: 20,
      fontFamily: 'Arial-BoldMT',
    },
    subtitleStyle: {
      color: '#666666',
      fontSize: 14,
      fontFamily: 'Arial',
    },
  },
};

export const customPostListStyles = {
  header: {
    profilePicture: {
      size: 40,
      profilePictureStyle: {
        borderRadius: 20,
      },
      fallbackTextStyle: {
        color: '#888888',
        fontSize: 14,
      },
    },
    titleText: {
      color: '#333333',
      fontSize: 16,
      fontFamily: 'Arial-BoldMT',
    },
    createdAt: {
      color: '#999999',
      fontSize: 12,
      fontFamily: 'Arial',
    },
    showMemberStateLabel: true,
    memberStateViewStyle: {
      backgroundColor: '#e0e0e0',
      borderRadius: 10,
      padding: 5,
    },
    memberStateTextStyle: {
      color: '#666666',
      fontSize: 12,
    },
    postHeaderViewStyle: {
      backgroundColor: '#f8f8f8',
      padding: 10,
    },
    showMenuIcon: true,
  },
  footer: {
    showBookMarkIcon: true,
    showShareIcon: true,
    saveButton: {
      text: {
        color: '#007bff',
        fontSize: 14,
      },
      // icon: {
      //   uri: 'https://example.com/save-icon.png',
      // },
      onTap: () => console.log('Save button tapped'),
      placement: 'end',
      buttonStyle: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        padding: 10,
      },
      isClickable: true,
    },
    shareButton: {
      onTap: () => console.log('Share button tapped'),
      placement: 'end',
      buttonStyle: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        padding: 10,
      },
      isClickable: true,
    },
    likeIconButton: {
      onTap: () => console.log('Like button tapped'),
      buttonStyle: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        padding: 10,
      },
      isClickable: true,
    },
    likeTextButton: {
      text: {
        color: '#007bff',
        fontSize: 14,
      },
      onTap: () => console.log('Like text button tapped'),
      buttonStyle: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        padding: 10,
      },
      isClickable: true,
    },
    commentButton: {
      text: {
        color: '#007bff',
        fontSize: 14,
      },
      onTap: () => console.log('Comment button tapped'),
      placement: 'end',
      buttonStyle: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        padding: 10,
      },
      isClickable: true,
    },
    footerBoxStyle: {
      backgroundColor: '#f1f1f1',
      padding: 10,
    },
  },
  postContent: {
    textStyle: {
      color: '#333333',
      fontSize: 16,
      fontFamily: 'Arial',
    },
    visibleLines: 3,
    showMoreText: {
      color: '#007bff',
      fontSize: 14,
    },
    postContentViewStyle: {
      padding: 10,
      backgroundColor: '#ffffff',
    },
    postTopicStyle: {
      text: {
        color: '#007bff',
        fontSize: 14,
      },
      box: {
        padding: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
      },
    },
  },
  media: {
    postMediaStyle: {
      borderRadius: 10,
      overflow: 'hidden',
    },
    image: {
      height: 200,
      width: '100%',
      imageStyle: {
        borderRadius: 10,
      },
      // boxFit: 'cover',
      boxStyle: {
        backgroundColor: 'blue',
      },
      aspectRatio: 1,
      showCancel: true,
      onCancel: () => console.log('Image cancel'),
      cancelButton: {
        text: {
          color: '#007bff',
        },
        onTap: () => console.log('Cancel button tapped'),
        placement: 'end',
        buttonStyle: {
          backgroundColor: 'red',
          borderRadius: 5,
          padding: 10,
        },
        isClickable: true,
      },
    },
    video: {
      height: 200,
      width: '100%',
      videoStyle: {
        borderRadius: 10,
      },
      boxFit: 'cover',
      boxStyle: {
        backgroundColor: '#cccccc',
      },
      aspectRatio: 1,
      showControls: true,
      looping: true,
      showCancel: true,
      onCancel: () => console.log('Video cancel'),
      cancelButton: {
        text: {
          color: '#007bff',
        },
        icon: {
          uri: 'https://example.com/cancel-icon.png',
        },
        onTap: () => console.log('Cancel button tapped'),
        placement: 'end',
        buttonStyle: {
          backgroundColor: '#ffffff',
          borderRadius: 5,
          padding: 10,
        },
        isClickable: true,
      },
    },
    carousel: {
      carouselStyle: {
        borderRadius: 10,
        overflow: 'hidden',
      },
      paginationBoxStyle: {
        bottom: 10,
        position: 'absolute',
      },
      activeIndicatorStyle: {
        backgroundColor: '#007bff',
        width: 10,
        height: 10,
        borderRadius: 5,
      },
      inactiveIndicatorStyle: {
        backgroundColor: '#cccccc',
        width: 10,
        height: 10,
        borderRadius: 5,
      },
      showCancel: true,
      cancelButton: {
        text: {
          color: '#007bff',
        },
        icon: {
          uri: 'https://example.com/cancel-icon.png',
        },
        placement: 'end',
        buttonStyle: {
          backgroundColor: '#ffffff',
          borderRadius: 5,
          padding: 10,
        },
        isClickable: true,
      },
    },
    document: {
      defaultIconSize: 24,
      showPageCount: true,
      showDocumentSize: true,
      showDocumentFormat: true,
      documentTitleStyle: {
        color: '#333333',
        fontSize: 16,
        fontFamily: 'Arial-BoldMT',
      },
      documentDetailStyle: {
        color: '#666666',
        fontSize: 14,
        fontFamily: 'Arial',
      },
      documentViewStyle: {
        padding: 10,
        backgroundColor: '#ffffff',
      },
      showCancel: true,
      showMoreText: true,
      showMoreTextStyle: {
        color: '#007bff',
        fontSize: 14,
      },
      cancelButton: {
        text: {
          color: '#007bff',
        },
      },
    },
  },
};
