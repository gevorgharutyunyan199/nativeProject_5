const makeAction = (type,payload)=>{
    return {
        type: type,
        payload: payload
    }
};

export {makeAction}