import {
    setBlockType,
    wrapIn
} from 'prosemirror-commands'
import {
    findParentNodeOfType
} from 'prosemirror-utils'

export const updateAttrOfNodeOfTypeCommand = (targetNode, args) => {
    return (state, dispatch, editorView) => {
        if (state.selection.empty) {
            const search = findParentNodeOfType(targetNode)(state.selection)
            console.log('update', targetNode, state, dispatch, editorView, args, search);
            if (dispatch && search && search.node) {
                return setBlockType(search.node.type, {
                    ...search.node.attrs,
                    ...args
                })(state, dispatch, editorView);
            }
            return search.node;
        } else {
            return true;
        }

        return false;
    }
}


export const setNodeOfTypeToNewTypeCommand = (targetNode, nodeType, args) => {
    return (state, dispatch, editorView) => {
        console.log('setNodeOfTypeToNewTypeCommand', targetNode, nodeType, state);
        if (state.selection.empty) {
            const search = findParentNodeOfType(targetNode)(state.selection)
            console.log('setBlockType', state, dispatch, editorView, nodeType, args, targetNode, search);
            if (dispatch && search && search.node) {
                console.log('setBlockType', state, dispatch, editorView, nodeType, args);
                return setBlockType(nodeType, {
                    ...args
                })(state, dispatch, editorView);
            }
            return search.node;
        } else {
            return true;
        }

        return false;
    }
}


export const wrapNodeOfTypeWithTypeCommand = (targetNode, nodeType, args) => {
    return (state, dispatch, editorView) => {
        if (state.selection.empty) {
            console.log('wrapt', targetNode, nodeType.name);
            const search = findParentNodeOfType(targetNode)(state.selection)
            console.log('wrapt', search, state);
            if (dispatch && search && search.node) {
                return wrapIn(
                    nodeType, {
                        ...args
                    })(state, dispatch);
            }
            return search !== undefined && search.node;
        } else {
            return true;
        }

        return false;
    }
}
export const isAttrEqInNodeOfType = (targetNode, args) => {
    return (state) => {
        const search = findParentNodeOfType(targetNode)(state.selection);
        if (search && search.node) {
            for (let prop in args) {
                if (search.node.attrs[prop] !== args[prop]) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}

export const getAttrsInNodeOfType = (targetNode) => {
    return (state) => {
        const search = findParentNodeOfType(targetNode)(state.selection);
        if (search && search.node) {
            return search.node.attrs;
        }

        return false;
    }
}

export function getAttrValueOfNodeOfType(nodeType, attr) {
    return (state) => {
        const attrs = getAttrsInNodeOfType(nodeType)(state);
        if (attrs && attrs[attr]) {
            return attrs[attr];
        }
        return null;
    }
}

export function getRandomString(len) {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < len; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}