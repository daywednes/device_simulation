import { Component, Input, Output } from 'rete';
import Socket from '../../../sockets';
import zonecomponent from './ZoneComponent.vue';
import 'style-loader!./style.sass';

export class ZoneComponent extends Component {

    constructor(item) {
        super(item.name);
        this.item = item;
        this.data.component = zonecomponent;
    }

    builder(node) {
        // node.name = this.item.name;
        // node.data = this.item;
        node.data = this.item;
        var out = new Output('pkg', "Zone", Socket.package);
        var inp = new Input('pkg', "Zone", Socket.package, true);
        return node.addInput(inp).addOutput(out);
    }

    worker() {}
}