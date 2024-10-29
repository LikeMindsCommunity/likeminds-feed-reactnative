import {
    CreatePostContextValues,
    useCreatePostContext,
    useCreatePostCustomisableMethodsContext
} from "../../context";
import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Layout from "../../constants/Layout";
import pluralizeOrCapitalize from "../../utils/variables";
import { WordAction } from "../../enums/Variables";
import { CommunityConfigs } from "../../communityConfigs";
import LMCheckbox from "../../uiComponents/LMCheckBox";

function LMCreatePostAnonymousCheckbox() {
    let {
        postToEdit,
        anonymousPost,
        handleOnAnonymousPostClicked,
        postDetail,
        setAnonymousPost
    }: CreatePostContextValues = useCreatePostContext();

    useEffect(() => {
        if (postDetail) {
            setAnonymousPost(postDetail?.isAnonymous ?? false)
        }
    }, [postDetail])


    const { hintTextForAnonymous, isAnonymousPostAllowed, handleOnAnonymousPostClickedProp } = useCreatePostCustomisableMethodsContext();

    return (
        <>
            {(isAnonymousPostAllowed && !postToEdit) ?
                <View style={{ marginTop: Layout.normalize(30), marginHorizontal: 15, flexDirection: 'row', flex: 1 }}>
                    <LMCheckbox label={(hintTextForAnonymous as string)?.length > 0 ?
                        hintTextForAnonymous :
                        `Share this as an anonymous ${pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.post ?? "post", WordAction.allSmallSingular)}`}
                        isChecked={anonymousPost}
                        onPress={handleOnAnonymousPostClickedProp ? handleOnAnonymousPostClickedProp : handleOnAnonymousPostClicked} />
                </View>
                :
                <></>
            }
        </>
    )
}

export default LMCreatePostAnonymousCheckbox

