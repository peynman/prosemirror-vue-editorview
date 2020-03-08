import {
    toggleMark,
    setBlockType,
    wrapIn,
    baseKeymap,
} from "prosemirror-commands";
import {
    Plugin
} from 'prosemirror-state'

import Paragraph from './Components/Paragraph.vue'
import Grid from './Components/Grid.vue'
import Card from './Components/Card.vue'
import CardTitle from './Components/CardTitle.vue'
import { schema } from "prosemirror-schema-basic";

const schemaSpec = {
    marks: {
        link: {
            attrs: {
                href: {},
                title: {
                    default: null
                }
            },
            inclusive: false,
            parseDOM: [{
                tag: "a[href]",
                getAttrs(dom) {
                    return {
                        href: dom.getAttribute("href"),
                        title: dom.getAttribute("title")
                    }
                }
            }],
            toDOM(node) {
                let {
                    href,
                    title
                } = node.attrs;
                return ["a", {
                    href,
                    title
                }, 0]
            }
        },
        em: {
            parseDOM: [{
                tag: "i"
            }, {
                tag: "em"
            }, {
                style: "font-style=italic"
            }],
            toDOM() {
                return ["em", 0]
            }
        },
        strong: {
            parseDOM: [{
                    tag: "strong"
                },
                {
                    tag: "b",
                    getAttrs: node => node.style.fontWeight != "normal" && null
                },
                {
                    style: "font-weight",
                    getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
                }
            ],
            toDOM() {
                return ["strong", 0]
            }
        },
        code: {
            parseDOM: [{
                tag: "code"
            }],
            toDOM() {
                return ["code", 0]
            }
        },
    },
}
export const ComponentUpdaterPlugin = (self) => new Plugin({
    props: {
        decorations: ({
            doc,
            plugins,
            selection
        }) => {
            self.editorTree = [];
            const {
                anchor
            } = selection;
            const decorations = [];
            doc.descendants((node, pos) => {
                const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize;
                if (hasAnchor && !node.isText) {
                    self.editorTree.push({
                        node,
                        settings: {
                            show: false,
                        }
                    });
                }
                return true;
            });
            self.editorTree = [];

            return null;
        }
    }
});

export default {
    Doc: {
        nodes: {
            doc: {
                content: "block+"
            },
            text: {
                group: "inline"
            }
        }
    },
    Strong: {
        spec: {
            menuItems: {
                strong: {
                    type: "btn",
                    title: "Bold",
                    icon: "mdi-format-bold",
                    command: toggleMark(schema.marks.strong),
                    mark: schema.marks.strong,
                    isActive: false,
                    isVisible: false
                }
            }
        },
        marks: {
            strong: schemaSpec.marks.strong,
        },
    },
    Italic: {
        spec: {
            menuItems: {
                italic: {
                    type: "btn",
                    title: "Italic",
                    icon: "mdi-format-italic",
                    command: toggleMark(schema.marks.em),
                    mark: schema.marks.em,
                    isActive: false,
                    isVisible: false
                }
            },
        },
        marks: {
            italic: schemaSpec.marks.em,
        },
    },
    Paragraph,
    Grid,
    Card,
    CardTitle,
    ComponentUpdaterPlugin,
}