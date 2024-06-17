import React from 'react';
import Player from 'react-player';

const RadioPlayer = ({ url }) => {
    return (
        <>
            <Player url={url} width="100%" height="80px" playing controls />
        </>
    );
};

export default RadioPlayer;