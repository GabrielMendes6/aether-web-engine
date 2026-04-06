import React from 'react';
import FlexSectionView from './FlexSectionView';
import FlexSectionEditor from './FlexSectionEditor';

export default function FlexSection(props) {
    console.log("DEBUG FLEX:", {
        isAdmin: props.isAdmin,
        path: window.location.pathname
    });

    if (props.isAdmin) {
        return <FlexSectionEditor {...props} />;
    }

    return <FlexSectionView {...props} />;
}