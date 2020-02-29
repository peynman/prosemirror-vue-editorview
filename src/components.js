import { Plugin } from 'prosemirror-state'

import Paragraph from './Components/Paragraph'
import Grid from './Components/Grid'
import Card from './Components/Card'
import CardTitle from './Components/CardTitle'

export const ComponentUpdater = (self) => new Plugin({
    props: {
        decorations: ({
            doc,
            plugins,
            selection
        }) => {
            self.editorTree = [];
            const { anchor } = selection;
            const decorations = [];
            doc.descendants((node, pos) => {
                const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize;
                if (hasAnchor && !node.isText) {
                    self.editorTree.push({node, settings: {show:false,}});
                }
                return true;
            });
            self.editorTree = [];

            return null;
        }
    }
});

export default {
    Paragraph,
    Grid,
    Card,
    CardTitle,
}
