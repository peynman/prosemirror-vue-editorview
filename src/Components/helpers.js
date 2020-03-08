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
            if (dispatch && search && search.node) {
                // console.log('updateAttrOfNodeOfTypeCommand setBlockType', targetNode, state, dispatch, editorView, args, search);
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
        // console.log('setNodeOfTypeToNewTypeCommand', targetNode, nodeType, state);
        if (state.selection.empty) {
            const search = findParentNodeOfType(targetNode)(state.selection)
            if (dispatch && search && search.node) {
                // console.log('setNodeOfTypeToNewTypeCommand setBlockType', state, dispatch, editorView, nodeType, args, targetNode, search);
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
            const search = findParentNodeOfType(targetNode)(state.selection)
                // console.log('wrapt', targetNode, nodeType, search, state);
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

export function ComponentUpdateNode(item, state, dispatch, editorView) {
    item.isVisible = item.value !== undefined ?
        item.command(item.value)(state, dispatch, editorView) :
        item.command(state, dispatch, editorView);
    if (item.updateValueCallback) {
        let newVal = item.updateValueCallback(state);
        if (item.type === "color") {
            if (newVal === null) {
                newVal = '';
            }
            if (newVal) {
                item.value = newVal;
                item.color = newVal;
            }
        }
        item.value = newVal;
    }
    if (item.isActiveCallback) {
        item.isActive = item.isActiveCallback(state);
    }
};